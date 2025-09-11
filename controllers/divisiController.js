// controllers/divisiController.js
const Divisi = require("../models/divisiModel");

exports.addDivisi = async (req, res) => {
  try {
    const { name, deskripsi } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await Divisi.create({ name, deskripsi });
    res.status(201).json({
      message: "Divisi created successfully",
      divisi_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating divisi" });
  }
};

exports.getAllDivisi = async (req, res) => {
  try {
    const results = await Divisi.findAll();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching divisi" });
  }
};

exports.getDivisiById = async (req, res) => {
  try {
    const divisi = await Divisi.findById(req.params.id);
    if (!divisi) return res.status(404).json({ message: "Divisi not found" });
    res.json(divisi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching divisi" });
  }
};

exports.updateDivisi = async (req, res) => {
  try {
    const { name, deskripsi } = req.body;
    const result = await Divisi.update(req.params.id, { name, deskripsi });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Divisi not found" });
    res.json({ message: "Divisi updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating divisi" });
  }
};

exports.deleteDivisi = async (req, res) => {
  try {
    const result = await Divisi.remove(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Divisi not found" });
    res.json({ message: "Divisi deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting divisi" });
  }
};
