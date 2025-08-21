const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const divisiRoutes = require("./routes/divisiRoutes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/divisi", divisiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));