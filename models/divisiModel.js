const db = require("../config/connection");

// Model untuk menambah divisi
const Divisi = {
  create: (data, callback) => {
    const { name, deskripsi } = data;
    const query = `
      INSERT INTO divisi (name, deskripsi, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `;
    db.query(query, [name, deskripsi], callback);
  },

  findAll: (callback) => {
    db.query("SELECT * FROM divisi", callback);
  },
};

module.exports = Divisi;
