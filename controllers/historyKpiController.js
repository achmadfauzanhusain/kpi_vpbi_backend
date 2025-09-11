const HistoryKpi = require("../models/historyKpiModel");
const db = require("../config/connection");
const { sendMail, newDataNotificationTemplate } = require("../config/mailer");

// Create History (Admin / Superadmin)
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

    // Simpan ke DB lewat model
    const history = await HistoryKpi.createHistoryWithDetails({
      user_id,
      periode,
      user_id_acc,
      details,
    });

    // ✅ Ambil email user setelah data berhasil disimpan
    let userEmail = null;
    let userNama = null;

    try {
      const [userRows] = await db.execute(
        `SELECT email, fullname FROM users WHERE user_id = ?`,
        [user_id]
      );
      if (userRows.length > 0) {
        userEmail = userRows[0].email;
        userNama = userRows[0].fullname;

        // Kirim email notifikasi 📧
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
      console.error("Gagal mengirim email:", mailErr);
    }

    res.status(201).json({
      message: "History created successfully",
      data: { ...history, email_terkirim: !!userEmail },
    });
  } catch (err) {
    console.error("Error createHistory:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get All Histories
const listHistory = async (req, res) => {
  try {
    const histories = await HistoryKpi.listHistory();

    res.status(200).json({
      message: "Histories fetched successfully",
      data: histories,
    });
  } catch (err) {
    console.error("Error listHistory:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
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

    res.status(200).json({
      message: "History fetched successfully",
      data: history,
    });
  } catch (err) {
    console.error("Error getHistoryDetail:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createHistory,
  listHistory,
  getHistoryDetail,
};
