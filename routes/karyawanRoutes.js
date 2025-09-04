const express = require("express");
const router = express.Router();
const { getAllKaryawan, getKaryawanById } = require("../controllers/karyawanController");

router.get("/", getAllKaryawan);
router.get("/:id", getKaryawanById);

module.exports = router;