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

