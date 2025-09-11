// models/divisiModel.js
const db = require("../config/connection");

const Divisi = {
  create: async ({ name, deskripsi }) => {
    const [result] = await db.query(
      "INSERT INTO divisi (name, deskripsi, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
      [name, deskripsi]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM divisi ORDER BY name ASC");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM divisi WHERE divisi_id = ?", [
      id,
    ]);
    return rows[0];
  },

  update: async (id, { name, deskripsi }) => {
    const [result] = await db.query(
      "UPDATE divisi SET name = ?, deskripsi = ?, updated_at = NOW() WHERE divisi_id = ?",
      [name, deskripsi, id]
    );
    return result;
  },

  remove: async (id) => {
    const [result] = await db.query("DELETE FROM divisi WHERE divisi_id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Divisi;
