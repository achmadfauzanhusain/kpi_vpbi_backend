const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/historyKpiController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Create History (Admin / Superadmin)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "superadmin"]),
  ctrl.createHistory
);

// List All Histories
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["superadmin", "admin", "karyawan"]),
  ctrl.listHistory
);

// Get Detail History by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["superadmin", "admin", "karyawan"]),
  ctrl.getHistoryDetail
);

module.exports = router;
