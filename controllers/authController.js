const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendMail, resetPasswordTemplate } = require("../config/mailer");

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role, jabatan, divisi_id } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create(
      fullname,
      email,
      hashedPassword,
      role,
      jabatan,
      divisi_id
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user_id: userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        divisi_id: user.divisi_id,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        fullname: user.fullname,
        role: user.role,
        divisi_id: user.divisi_id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REQUEST RESET PASSWORD
exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    // cek apakah email ada di database
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Email tidak terdaftar" });
    }

    // generate token reset password
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const resetLink = `${FRONTEND_URL}/reset-password/${encodeURIComponent(
      token
    )}`;

    // kirim email reset password
    await sendMail({
      to: email,
      subject: "Reset Password - KPI System",
      text: `Klik link berikut untuk reset password Anda: ${resetLink}`,
      html: resetPasswordTemplate(resetLink),
    });

    res.json({ message: "Link reset telah dikirim ke email Anda" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByEmail(decoded.email);

    if (!user) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updatePassword(user.user_id, hashedPassword);

    res.json({ message: "Password berhasil direset, silakan login" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token kadaluarsa" });
    }
    res.status(400).json({ message: "Token tidak valid", error: err.message });
  }
};
