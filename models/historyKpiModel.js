const db = require("../config/connection");

// Helper: expand placeholder untuk IN
function buildInPlaceholders(arr) {
  return arr.map(() => "?").join(", ");
}

// Create history with details + weighted calculation
async function createHistoryWithDetails(data) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [historyResult] = await conn.execute(
      `INSERT INTO history_kpi 
        (user_id, periode, user_id_acc, nilai_akhir, persen_akhir, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        Number(data.user_id),
        data.periode,
        Number(data.user_id_acc) || null,
        0,
        0,
      ]
    );

    const historyId = historyResult.insertId;

    // Ambil bobot KPI dari tabel master_kpi
    const kpiIds = data.details.map((d) => Number(d.kpi_id)).filter(Boolean);
    let bobotMap = {};

    if (kpiIds.length > 0) {
      const placeholders = buildInPlaceholders(kpiIds);
      const [kpis] = await conn.query(
        `SELECT kpi_id, bobot FROM master_kpi WHERE kpi_id IN (${placeholders})`,
        kpiIds
      );

      kpis.forEach((kpi) => {
        bobotMap[kpi.kpi_id] = kpi.bobot;
      });
    }

    let totalNilai = 0;
    let totalPersen = 0;

    for (const d of data.details) {
      const kpiId = Number(d.kpi_id);
      const bobot = bobotMap[kpiId] || 0;

      await conn.execute(
        `INSERT INTO history_kpi_detail 
          (history_kpi_id, kpi_id, nilai_real, persen_real, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [historyId, kpiId, Number(d.nilai_real), Number(d.persen_real)]
      );

      totalNilai += Number(d.nilai_real) * (bobot / 100);
      totalPersen += Number(d.persen_real) * (bobot / 100);
    }

    await conn.execute(
      `UPDATE history_kpi 
       SET nilai_akhir = ?, persen_akhir = ? 
       WHERE history_id = ?`,
      [totalNilai, totalPersen, historyId]
    );

    await conn.commit();
    return {
      id: historyId,
      ...data,
      nilai_akhir: totalNilai,
      persen_akhir: totalPersen,
    };
  } catch (error) {
    await conn.rollback();
    console.error("[createHistoryWithDetails] Error:", error);
    throw error;
  } finally {
    conn.release();
  }
}

// List history dengan filter
async function listHistory(filters = {}) {
  let {
    periode_from,
    periode_to,
    divisi_id,
    user_id,
    search,
    jabatan,
    limit = 20,
    offset = 0,
  } = filters;

  const where = [];
  const params = [];

  if (periode_from) {
    where.push("hk.periode >= ?");
    params.push(periode_from);
  }
  if (periode_to) {
    where.push("hk.periode <= ?");
    params.push(periode_to);
  }
  if (user_id && !isNaN(Number(user_id))) {
    where.push("hk.user_id = ?");
    params.push(Number(user_id));
  }
  if (divisi_id && !isNaN(Number(divisi_id))) {
    where.push("u.divisi_id = ?");
    params.push(Number(divisi_id));
  }
  if (jabatan) {
    where.push("u.jabatan = ?");
    params.push(jabatan);
  }
  if (search) {
    where.push("(u.fullname LIKE ? OR u.email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // pastikan limit & offset valid integer
  const safeLimit = Number.isInteger(Number(limit)) ? Number(limit) : 20;
  const safeOffset = Number.isInteger(Number(offset)) ? Number(offset) : 0;

  const sql = `
    SELECT hk.history_id, hk.user_id, hk.periode, hk.nilai_akhir, hk.persen_akhir,
           hk.user_id_acc, hk.created_at, hk.updated_at,
           u.fullname, u.email, u.jabatan, u.divisi_id,
           ua.fullname AS admin_fullname, ua.email AS admin_email
    FROM history_kpi hk
    JOIN users u ON u.user_id = hk.user_id
    LEFT JOIN users ua ON ua.user_id = hk.user_id_acc
    ${whereSQL}
    ORDER BY hk.periode DESC, hk.created_at DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}
  `;

  const countSql = `
    SELECT COUNT(1) as total
    FROM history_kpi hk
    JOIN users u ON u.user_id = hk.user_id
    ${whereSQL}
  `;

  const [rows] = await db.execute(sql, params);
  const [countRows] = await db.execute(countSql, params);

  console.log("[listHistory] whereSQL:", whereSQL);
  console.log("[listHistory] params:", params);
  console.log("[listHistory] safeLimit:", safeLimit, "safeOffset:", safeOffset);

  return {
    rows: rows || [],
    total: countRows[0] ? Number(countRows[0].total) : 0,
  };
}

// Get detail history
async function getHistoryDetail(history_id) {
  const sql = `
    SELECT hk.history_id, hk.user_id, hk.periode, hk.nilai_akhir, hk.persen_akhir,
           hk.user_id_acc, hk.created_at, hk.updated_at,
           u.fullname, u.email, u.jabatan, u.divisi_id,
           ua.fullname AS admin_fullname, ua.email AS admin_email,
           hkd.history_detail_id, hkd.kpi_id, hkd.nilai_real, hkd.persen_real,
           mk.indikator, mk.satuan, mk.target, mk.bobot
    FROM history_kpi hk
    JOIN users u ON u.user_id = hk.user_id
    LEFT JOIN users ua ON ua.user_id = hk.user_id_acc
    LEFT JOIN history_kpi_detail hkd ON hkd.history_kpi_id = hk.history_id
    LEFT JOIN master_kpi mk ON mk.kpi_id = hkd.kpi_id
    WHERE hk.history_id = ?
  `;

  const [rows] = await db.execute(sql, [Number(history_id)]);

  if (!rows.length) return null;

  const header = {
    history_id: rows[0].history_id,
    user_id: rows[0].user_id,
    periode: rows[0].periode,
    nilai_akhir: rows[0].nilai_akhir,
    persen_akhir: rows[0].persen_akhir,
    user_id_acc: rows[0].user_id_acc,
    created_at: rows[0].created_at,
    updated_at: rows[0].updated_at,
    fullname: rows[0].fullname,
    email: rows[0].email,
    jabatan: rows[0].jabatan,
    divisi_id: rows[0].divisi_id,
    admin_fullname: rows[0].admin_fullname,
    admin_email: rows[0].admin_email,
  };

  const details = rows
    .filter((r) => r.history_detail_id)
    .map((r) => ({
      history_detail_id: r.history_detail_id,
      kpi_id: r.kpi_id,
      nilai_real: r.nilai_real,
      persen_real: r.persen_real,
      bobot: r.bobot,
      target: r.target,
      indikator: r.indikator,
      satuan: r.satuan,
    }));

  return { ...header, details };
}

module.exports = {
  listHistory,
  createHistoryWithDetails,
  getHistoryDetail,
};
