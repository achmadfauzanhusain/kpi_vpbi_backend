// routes/divisiRoutes.js
const express = require("express");
const router = express.Router();
const {
  addDivisi,
  getAllDivisi,
  getDivisiById,
  updateDivisi,
  deleteDivisi,
} = require("../controllers/divisiController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Semua endpoint divisi butuh login
router.use(authenticateToken);

// GET semua divisi -> boleh diakses semua role
router.get("/", getAllDivisi);
router.get("/:id", getDivisiById);

// Endpoint yang bisa ubah data -> hanya superadmin
router.post("/", authorizeRoles(["superadmin"]), addDivisi);
router.put("/:id", authorizeRoles(["superadmin"]), updateDivisi);
router.delete("/:id", authorizeRoles(["superadmin"]), deleteDivisi);

module.exports = router;
