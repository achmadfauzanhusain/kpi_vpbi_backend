const HistoryKpi = require("../models/historyKpiModel");

// Create History (Admin / Superadmin)
const createHistory = async (req, res) => {
  try {
    const { user_id, periode, user_id_acc, details } = req.body;

    console.log("REQ BODY:", req.body); // cek seluruh payload
    console.log("DETAILS:", details); // cek array details

    if (
      !user_id ||
      !periode ||
      !user_id_acc ||
      !details ||
      details.length === 0
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // panggil model dengan single object
    const history = await HistoryKpi.createHistoryWithDetails({
      user_id,
      periode,
      user_id_acc,
      details,
    });

    res.status(201).json({
      message: "History created successfully",
      data: history,
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
