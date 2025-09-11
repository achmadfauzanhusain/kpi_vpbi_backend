const db = require("../config/connection");

const User = {
  // Cari user berdasarkan email
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  // Buat user baru
  create: async ({ fullname, email, password, role, jabatan, divisi_id }) => {
    const [result] = await db.query(
      `INSERT INTO users (fullname, email, password, role, jabatan, divisi_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [fullname, email, password, role, jabatan, divisi_id]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await db.query(
      "SELECT u.*, d.name as divisi_name FROM users u LEFT JOIN divisi d ON u.divisi_id = d.divisi_id"
    );
    return rows;
  },

  // Ambil semua user di divisi tertentu
  findAllByDivisi: async (divisi_id) => {
    const [rows] = await db.query(
      "SELECT u.*, d.name as divisi_name FROM users u LEFT JOIN divisi d ON u.divisi_id = d.divisi_id WHERE u.divisi_id = ?",
      [divisi_id]
    );
    return rows;
  },

  // Cari user berdasarkan ID
  findById: async (user_id) => {
    const [rows] = await db.query(
      `SELECT u.user_id, u.fullname, u.email, u.role, u.jabatan, u.divisi_id, d.name as nama_divisi, u.created_at, u.updated_at
       FROM users u
       LEFT JOIN divisi d ON u.divisi_id = d.divisi_id
       WHERE u.user_id = ?`,
      [user_id]
    );
    return rows[0];
  },

  // Update user
  update: async (user_id, data) => {
    const { fullname, email, password, jabatan, divisi_id } = data;
    await db.query(
      `UPDATE users
       SET fullname = ?, email = ?, password = ?, jabatan = ?, divisi_id = ?, updated_at = NOW()
       WHERE user_id = ?`,
      [fullname, email, password, jabatan, divisi_id, user_id]
    );
  },

  // Update hanya password
  updatePassword: async (user_id, hashedPassword) => {
    await db.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?",
      [hashedPassword, user_id]
    );
  },

  // Hapus user
  delete: async (user_id) => {
    await db.query("DELETE FROM users WHERE user_id = ?", [user_id]);
  },
};

module.exports = User;
