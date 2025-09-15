const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const divisiRoutes = require("./routes/divisiRoutes");
const historyKpiRoutes = require("./routes/historyKpiRoutes");
const masterKpiRoutes = require("./routes/masterKpiRoutes");

const app = express();
const cors = require("cors");
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // kalau pakai cookie/session
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/divisi", divisiRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/history-kpi", historyKpiRoutes);
app.use("/api/master-kpi", masterKpiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
