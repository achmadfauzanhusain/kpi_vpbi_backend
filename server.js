const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const divisiRoutes = require("./routes/divisiRoutes");
const historyKpiRoutes = require("./routes/historyKpiRoutes");
const masterKpiRoutes = require("./routes/masterKpiRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/divisi", divisiRoutes);
app.use("/api/laporan-kpi", historyKpiRoutes);
app.use("/api/master-kpi", masterKpiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
