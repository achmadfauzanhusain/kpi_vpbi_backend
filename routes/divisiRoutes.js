const express = require("express");
const router = express.Router();
const { addDivisi, getAllDivisi } = require("../controllers/divisiController");

// Tambah divisi
router.post("/", addDivisi);

// Get semua divisi
router.get("/", getAllDivisi);

module.exports = router;