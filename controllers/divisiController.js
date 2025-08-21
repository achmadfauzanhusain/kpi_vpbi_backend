const Divisi = require("../models/divisiModel");

exports.addDivisi = (req, res) => {
  const { name, deskripsi } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  Divisi.create({ name, deskripsi }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error creating divisi" });
    }

    res.status(201).json({
      message: "Divisi created successfully",
      divisi_id: result.insertId,
    });
  });
};

exports.getAllDivisi = (req, res) => {
  Divisi.findAll((err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching divisi" });
    }

    res.json(results);
  });
};
