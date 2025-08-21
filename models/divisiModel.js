const db = require("../config/connection");

// pakai async/await, bukan callback
const Divisi = {
  create: async (data) => {
    const { name, deskripsi } = data;
    const query = `
      INSERT INTO divisi (name, deskripsi, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `;
    const [result] = await db.query(query, [name, deskripsi]);
    return result;
  },

  findAll: async () => {
    const [rows] = await db.query("SELECT * FROM divisi");
    return rows;
  },
};

module.exports = Divisi;