const db = require("../config/connection");

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  create: async (fullname, email, hashedPassword, role, jabatan, divisi_id) => {
    const [result] = await db.query(
      "INSERT INTO users (fullname, email, password, role, jabatan, divisi_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [fullname, email, hashedPassword, role, jabatan, divisi_id]
    );
    return result.insertId;
  },

  findAllKaryawan: async () => {
    const [rows] = await db.query("SELECT * FROM users WHERE role = 'karyawan'");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { fullname, email, password, jabatan, divisi_id } = data;
    await db.query(
      "UPDATE users SET fullname = ?, email = ?, password = ?, jabatan = ?, divisi_id = ?, updated_at = NOW() WHERE id = ?",
      [fullname, email, password, jabatan, divisi_id, id]
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
  }
};

module.exports = User;
