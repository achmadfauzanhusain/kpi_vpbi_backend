const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/karyawanController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles(["admin", "superadmin"]), ctrl.getAllKaryawan);
router.get(
  "/:id",
  authorizeRoles(["admin", "superadmin", "karyawan"]),
  ctrl.getKaryawanById
);
router.post("/add", authorizeRoles(["admin", "superadmin"]), ctrl.addKaryawan);
router.put(
  "/update/:id",
  authorizeRoles(["admin", "superadmin", "karyawan"]),
  ctrl.updateKaryawan
);
router.delete(
  "/delete/:id",
  authorizeRoles(["admin", "superadmin"]),
  ctrl.deleteKaryawan
);

module.exports = router;
