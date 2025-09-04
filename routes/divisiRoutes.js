const express = require("express");
const router = express.Router();
const { addDivisi, getAllDivisi } = require("../controllers/divisiController");

router.post("/", addDivisi);
router.get("/", getAllDivisi);

module.exports = router;