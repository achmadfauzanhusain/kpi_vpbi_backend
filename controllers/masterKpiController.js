// controllers/masterKpi.controller.js
const MasterModel = require("../models/masterKpiModel");

async function create(req, res) {
  try {
    const { divisi_id, indikator, satuan, target, bobot } = req.body;
    if (!divisi_id || !indikator)
      return res
        .status(400)
        .json({ message: "divisi_id and indikator required" });
    const id = await MasterModel.createKpi({
      divisi_id,
      indikator,
      satuan,
      target,
      bobot,
    });
    return res.status(201).json({ message: "created", kpi_id: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function list(req, res) {
  try {
    const { divisi_id, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const rows = await MasterModel.listKpi({
      divisi_id,
      search,
      limit,
      offset,
    });
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const row = await MasterModel.getKpiById(id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    await MasterModel.updateKpi(id, req.body);
    res.json({ message: "updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    await MasterModel.deleteKpi(id);
    res.json({ message: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { create, list, getById, update, remove };
