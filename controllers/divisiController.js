const Divisi = require("../models/divisiModel");

exports.addDivisi = async (req, res) => {
  try {
    const { name, deskripsi } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

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
