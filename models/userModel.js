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

  // getAllUser:
};

module.exports = User;
