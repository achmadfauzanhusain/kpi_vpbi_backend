require("dotenv").config();
const db = require("./config/connection"); // pastikan path sesuai dengan file koneksi mysql2 kamu
const bcrypt = require("bcrypt");

async function seed() {
  try {
    console.log("🔄 Clearing tables...");
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE users");
    await db.query("TRUNCATE TABLE divisi");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("🌱 Inserting divisi...");
    await db.query(
      `INSERT INTO divisi (name, deskripsi, created_at, updated_at) VALUES
      ('Manajemen', 'Divisi pimpinan perusahaan', NOW(), NOW()),
      ('IT', 'Divisi Teknologi Informasi', NOW(), NOW()),
      ('HRD', 'Divisi Sumber Daya Manusia', NOW(), NOW())`
    );

    const hashedPassword = await bcrypt.hash("12345678", 10);

    console.log("🌱 Inserting users...");
    await db.query(
      `INSERT INTO users (fullname, email, password, role, jabatan, divisi_id, created_at, updated_at) VALUES
      ('Super Admin', 'superadmin@company.com', ?, 'superadmin', 'Pimpinan Perusahaan', NULL, NOW(), NOW()),
      ('Admin IT', 'admin.it@company.com', ?, 'admin', 'Kepala Divisi IT', 2, NOW(), NOW()),
      ('Admin HRD', 'admin.hrd@company.com', ?, 'admin', 'Kepala Divisi HRD', 3, NOW(), NOW()),
      ('Budi Santoso', 'budi.it@company.com', ?, 'karyawan', 'Staff IT', 2, NOW(), NOW()),
      ('Siti Aminah', 'siti.it@company.com', ?, 'karyawan', 'Programmer', 2, NOW(), NOW()),
      ('Andi Wijaya', 'andi.hrd@company.com', ?, 'karyawan', 'Staff HRD', 3, NOW(), NOW())`,
      [
        hashedPassword,
        hashedPassword,
        hashedPassword,
        hashedPassword,
        hashedPassword,
        hashedPassword,
      ]
    );

    console.log("✅ Seeding selesai!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error saat seeding:", err.message);
    process.exit(1);
  }
}

seed();
