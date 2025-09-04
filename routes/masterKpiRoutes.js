// routes/masterKpi.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/masterKpiController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "superadmin"]),
  ctrl.create
);
router.get("/", authenticateToken, ctrl.list);
router.get("/:id", authenticateToken, ctrl.getById);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "superadmin"]),
  ctrl.update
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "superadmin"]),
  ctrl.remove
);

module.exports = router;
