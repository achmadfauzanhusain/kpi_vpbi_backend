const db = require("../config/connection");

async function createKpi({ divisi_id, indikator, satuan, target, bobot }) {
  const query = `INSERT INTO master_kpi 
    (divisi_id, indikator, satuan, target, bobot, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())`;
  const [result] = await db.execute(query, [
    Number(divisi_id),
    indikator,
    satuan,
    Number(target),
    Number(bobot),
  ]);
  return result.insertId;
}

async function updateKpi(kpi_id, data) {
  const fields = [];
  const values = [];
  for (const key of ["divisi_id", "indikator", "satuan", "target", "bobot"]) {
    if (key in data) {
      fields.push(`${key} = ?`);
      if (["divisi_id", "target", "bobot"].includes(key)) {
        values.push(Number(data[key]));
      } else {
        values.push(data[key]);
      }
    }
  }
  if (!fields.length) return null;
  values.push(Number(kpi_id));
  const query = `UPDATE master_kpi SET ${fields.join(", ")} WHERE kpi_id = ?`;
  await db.execute(query, values);
  return true;
}

async function deleteKpi(kpi_id) {
  const query = `UPDATE master_kpi SET deleted_at = NOW() WHERE kpi_id = ?`;
  await db.execute(query, [Number(kpi_id)]);
  return true;
}

async function getKpiById(kpi_id) {
  const [rows] = await db.execute(`SELECT * FROM master_kpi WHERE kpi_id = ?`, [
    Number(kpi_id),
  ]);
  return rows[0] || null;
}

// list with optional filters: divisi_id, search indikator
async function listKpi({ divisi_id, search, limit = 20, offset = 0 }) {
  const where = ["deleted_at IS NULL"];
  const params = [];

  if (divisi_id && !isNaN(Number(divisi_id))) {
    where.push("divisi_id = ?");
    params.push(Number(divisi_id));
  }

  if (search) {
    where.push("indikator LIKE ?");
    params.push(`%${search}%`);
  }

  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // pastikan integer
  const safeLimit = Number(limit);
  const safeOffset = Number(offset);

  const query = `
    SELECT * 
    FROM master_kpi 
    ${whereSQL} 
    ORDER BY created_at DESC 
    LIMIT ?, ?
  `;

  const execParams = [
    ...params,
    isNaN(safeOffset) ? 0 : safeOffset,
    isNaN(safeLimit) ? 20 : safeLimit,
  ];

  console.log("[listKpi] SQL:", query);
  console.log("[listKpi] execParams:", execParams);

  const [rows] = await db.execute(query, execParams);
  return rows;
}

module.exports = { createKpi, updateKpi, deleteKpi, getKpiById, listKpi };
