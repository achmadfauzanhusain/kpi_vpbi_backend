const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Fungsi untuk generate template HTML
function resetPasswordTemplate(link) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2c3e50;">🔐 Reset Password</h2>
    <p>Anda menerima email ini karena ada permintaan reset password untuk akun Anda.</p>
    <p>
      Klik tombol di bawah untuk mengubah password:
    </p>
    <p style="text-align: center;">
      <a href="${link}" 
         style="display: inline-block; padding: 10px 20px; 
                background-color: #4f46e5; color: #fff; 
                text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>
    </p>
    <p>Atau copy-paste link berikut ke browser Anda:</p>
    <p style="word-break: break-all; color: #1d4ed8;">${link}</p>
    <p><i>Link ini berlaku selama 15 menit.</i></p>
    <hr/>
    <p style="font-size: 12px; color: #777;">
      KPI System - Email otomatis, jangan dibalas.
    </p>
  </div>
  `;
}

function newDataNotificationTemplate({ title, description, createdBy }) {
  return `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #2c3e50;">📊 Notifikasi Data Baru</h2>
    <p>Data baru telah ditambahkan ke sistem KPI:</p>
    <ul>
      <li><b>Judul:</b> ${title}</li>
      <li><b>Deskripsi:</b> ${description}</li>
      <li><b>Dibuat oleh:</b> ${createdBy}</li>
    </ul>
    <p>Silakan cek dashboard untuk detail lebih lanjut.</p>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 10px 20px; background-color: #16a34a; color: #fff; text-decoration: none; border-radius: 6px;">
        Buka Dashboard
      </a>
    </p>
    <hr/>
    <p style="font-size: 12px; color: #777;">KPI System - Email otomatis, jangan dibalas.</p>
  </div>`;
}

// Fungsi reusable untuk kirim email
async function sendMail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"KPI System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    if (process.env.SMTP_HOST === "smtp.ethereal.email") {
      console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Gagal mengirim email");
  }
}

module.exports = {
  sendMail,
  resetPasswordTemplate,
  newDataNotificationTemplate,
};
