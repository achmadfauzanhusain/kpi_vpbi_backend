const db = require("../config/connection");

async function createKpi({ divisi_id, indikator, satuan, target, bobot }) {
  const query = `INSERT INTO master_kpi 
    (divisi_id, indikator, satuan, target, bobot, created_at) 
    VALUES (?, ?, ?, ?, ?, NOW())`;
  const [result] = await db.execute(query, [
    divisi_id,
    indikator,
    satuan,
    target,
    bobot,
  ]);
  return result.insertId;
}

async function updateKpi(kpi_id, data) {
  const fields = [];
  const values = [];
  for (const key of ["divisi_id", "indikator", "satuan", "target", "bobot"]) {
    if (key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (!fields.length) return null;
  values.push(kpi_id);
  const query = `UPDATE master_kpi SET ${fields.join(", ")} WHERE kpi_id = ?`;
  await db.execute(query, values);
  return true;
}

async function deleteKpi(kpi_id) {
  const query = `UPDATE master_kpi SET deleted_at = NOW() WHERE kpi_id = ?`;
  await db.execute(query, [kpi_id]);
  return true;
}

async function getKpiById(kpi_id) {
  const [rows] = await db.execute(`SELECT * FROM master_kpi WHERE kpi_id = ?`, [
    kpi_id,
  ]);
  return rows[0] || null;
}

// list with optional filters: divisi_id, search indikator
async function listKpi({ divisi_id, search, limit = 20, offset = 0 }) {
  const where = ["deleted_at IS NULL"];
  const params = [];
  if (divisi_id) {
    where.push("divisi_id = ?");
    params.push(divisi_id);
  }
  if (search) {
    where.push("indikator LIKE ?");
    params.push(`%${search}%`);
  }
  const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const query = `SELECT * FROM master_kpi ${whereSQL} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  const [rows] = await db.execute(query, params);
  return rows;
}

module.exports = { createKpi, updateKpi, deleteKpi, getKpiById, listKpi };
