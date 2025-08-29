const User = require("../models/userModel");

// Get all karyawan
exports.getAllKaryawan = async (req, res) => {
  try {
    const karyawan = await User.find({ role: "karyawan" });
    res.status(200).json(karyawan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get karyawan by ID
exports.getKaryawanById = async (req, res) => {
    try {
        const karyawan = await User.findById(req.params.id)
        if (!karyawan || karyawan.role !== "karyawan") {
        return res.status(404).json({ message: "Karyawan not found" })
        }
        res.status(200).json(karyawan)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// tambah karyawan
exports.addKaryawan = async (req, res) => {
  try {
    const { fullname, email, password, jabatan, divisi_id } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newKaryawan = await User.create({ fullname, email, password, role: "karyawan", jabatan, divisi_id });
    res.status(201).json({ message: "Karyawan created successfully", karyawan_id: newKaryawan.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update karyawan
exports.updateKaryawan = async (req, res) => {
  try {
    const { fullname, email, password, jabatan, divisi_id } = req.body;

    const karyawan = await User.findById(req.params.id);
    if (!karyawan || karyawan.role !== "karyawan") {
      return res.status(404).json({ message: "Karyawan not found" });
    }

    if (email && email !== karyawan.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        karyawan.email = email;
    }

    karyawan.fullname = fullname || karyawan.fullname;
    karyawan.password = password || karyawan.password;
    karyawan.jabatan = jabatan || karyawan.jabatan;
    karyawan.divisi_id = divisi_id || karyawan.divisi_id;
    await User.update(req.params.id, karyawan);

    res.status(200).json({ message: "Karyawan updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete karyawan
exports.deleteKaryawan = async (req, res) => {
  try {
    const karyawan = await User.findById(req.params.id);
    if (!karyawan || karyawan.role !== "karyawan") {
      return res.status(404).json({ message: "Karyawan not found" });
    }
    await User.delete(req.params.id);
    res.status(200).json({ message: "Karyawan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};