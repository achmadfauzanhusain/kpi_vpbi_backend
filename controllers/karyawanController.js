const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.getAllKaryawan = async (req, res) => {
  try {
    console.log("User info from token:", req.user);

    let karyawan = [];

    if (req.user.role === "superadmin") {
      // superadmin → lihat semua termasuk dirinya sendiri
      karyawan = await User.findAll();
    } else if (req.user.role === "admin") {
      // admin → hanya karyawan di divisi nya (termasuk dirinya sendiri)
      karyawan = await User.findAllByDivisi(req.user.divisi_id);
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: You don't have access" });
    }

    res.status(200).json(karyawan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getKaryawanById = async (req, res) => {
  try {
    const { id } = req.params;
    const karyawan = await User.findById(id);

    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan not found" });
    }

    // superadmin → boleh lihat semua
    if (req.user.role === "superadmin") {
      return res.status(200).json(karyawan);
    }

    // admin → hanya boleh lihat karyawan di divisinya
    if (
      req.user.role === "admin" &&
      karyawan.divisi_id === req.user.divisi_id
    ) {
      return res.status(200).json(karyawan);
    }

    // karyawan → hanya boleh lihat dirinya sendiri
    if (req.user.role === "karyawan" && karyawan.user_id === req.user.id) {
      return res.status(200).json(karyawan);
    }

    return res
      .status(403)
      .json({ message: "Forbidden: You don't have access" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addKaryawan = async (req, res) => {
  try {
    const { fullname, email, jabatan, divisi_id } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const password = "12345678";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role adalah karyawan
    const insertId = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: "karyawan",
      jabatan,
      divisi_id,
    });

    res.status(201).json({
      message: "Karyawan created successfully",
      karyawan_id: insertId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateKaryawan = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, jabatan, divisi_id } = req.body;

    const karyawan = await User.findById(id);
    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan not found" });
    }

    // superadmin → boleh update siapa saja
    if (req.user.role === "superadmin") {
      await User.update(id, { fullname, email, password, jabatan, divisi_id });
      return res.status(200).json({ message: "Karyawan updated successfully" });
    }

    // admin → hanya boleh update karyawan di divisinya
    if (
      req.user.role === "admin" &&
      karyawan.divisi_id === req.user.divisi_id
    ) {
      await User.update(id, { fullname, email, password, jabatan, divisi_id });
      return res.status(200).json({ message: "Karyawan updated successfully" });
    }

    // karyawan → hanya boleh update dirinya sendiri (fullname, email, password)
    if (req.user.role === "karyawan" && karyawan.user_id === req.user.id) {
      await User.update(id, {
        fullname,
        email,
        password,
        jabatan: karyawan.jabatan,
        divisi_id: karyawan.divisi_id,
      });
      return res.status(200).json({ message: "Profile updated successfully" });
    }

    return res
      .status(403)
      .json({ message: "Forbidden: You don't have access" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteKaryawan = async (req, res) => {
  try {
    const { id } = req.params;
    const karyawan = await User.findById(id);

    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan not found" });
    }

    // superadmin → boleh hapus siapa saja
    if (req.user.role === "superadmin") {
      await User.delete(id);
      return res.status(200).json({ message: "Karyawan deleted successfully" });
    }

    // admin → hanya boleh hapus karyawan di divisinya
    if (
      req.user.role === "admin" &&
      karyawan.divisi_id === req.user.divisi_id
    ) {
      await User.delete(id);
      return res.status(200).json({ message: "Karyawan deleted successfully" });
    }

    return res
      .status(403)
      .json({ message: "Forbidden: You don't have access" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
