const HistoryKpi = require("../models/historyKpiModel");
const db = require("../config/connection");
const { sendMail, newDataNotificationTemplate } = require("../config/mailer");

// Create History
const createHistory = async (req, res) => {
  try {
    const { user_id, periode, user_id_acc, details } = req.body;

    if (
      !user_id ||
      !periode ||
      !user_id_acc ||
      !details ||
      details.length === 0
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const history = await HistoryKpi.createHistoryWithDetails({
      user_id,
      periode,
      user_id_acc,
      details,
    });

    // Kirim email (optional)
    try {
      const [userRows] = await db.execute(
        `SELECT email, fullname FROM users WHERE user_id = ?`,
        [user_id]
      );

      if (userRows.length > 0) {
        const { email: userEmail, fullname: userNama } = userRows[0];
        await sendMail({
          to: userEmail,
          subject: "📢 KPI Baru Ditambahkan",
          text: `Halo ${userNama}, KPI Anda untuk periode ${periode} sudah ditambahkan.`,
          html: newDataNotificationTemplate({
            title: `Halo ${userNama},`,
            description: `KPI Anda untuk periode <b>${periode}</b> sudah berhasil ditambahkan.`,
            createdBy: user_id_acc || "Admin",
          }),
        });
      }
    } catch (mailErr) {
      console.error("[createHistory] Gagal kirim email:", mailErr.message);
    }

    res.status(201).json({
      message: "History created successfully",
      data: history,
    });
  } catch (err) {
    console.error("[createHistory] Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get All Histories
const listHistory = async (req, res) => {
  try {
    const { role, user_id, divisi_id } = req.user || {};
    let filters = { ...req.query };

    // Role-based filter
    if (role === "admin" && divisi_id) {
      filters.divisi_id = filters.divisi_id || divisi_id;
    } else if (role === "karyawan" && user_id) {
      filters.user_id = filters.user_id || user_id;
    }
    // superadmin = bebas

    // Bersihin filter kosong/null
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] === undefined ||
        filters[key] === null ||
        filters[key] === "" ||
        filters[key] === "null" ||
        filters[key] === "undefined"
      ) {
        delete filters[key];
      }
    });

    const histories = await HistoryKpi.listHistory(filters);

    res.status(200).json({
      message: "Histories fetched successfully",
      data: histories.rows || [],
      total: histories.total || 0,
    });

    console.log("[listHistory] Incoming query:", req.query);
    console.log("[listHistory] Final filters:", filters);
  } catch (err) {
    console.error("[listHistory] Error:", err.message, err.sqlMessage || "");
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      stack: err.stack, // tambahin stack trace
      sql: err.sql, // tambahin SQL kalau ada
      sqlMessage: err.sqlMessage,
    });
  }
};

// Get History by ID
const getHistoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await HistoryKpi.getHistoryDetail(id);

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res
      .status(200)
      .json({ message: "History fetched successfully", data: history });
  } catch (err) {
    console.error("[getHistoryDetail] Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  createHistory,
  listHistory,
  getHistoryDetail,
};
