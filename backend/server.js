const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ROUTE UTAMA UNTUK CEK SERVER
app.get("/", (req, res) => {
  res.send("API is running...");
});

// CONFIG MULTER (upload file KTP)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// API POST Check-In
app.post("/checkin", upload.single("ktp"), (req, res) => {
  const { nama, booking, no_hp, email } = req.body;

  // CEK jika tidak ada file
  if (!req.file) {
    return res.status(400).json({ message: "File KTP wajib diupload." });
  }

  const fotoKTP = req.file.filename;

  const sql = `
      INSERT INTO checkin (nama, booking, no_hp, email, foto_ktp)
      VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [nama, booking, no_hp, email, fotoKTP], (err) => {
    if (err) return res.status(500).json({ message: "DB error", err });

    res.json({ message: "Check-in berhasil!" });
  });
});

// Ambil daftar check-in (untuk staf FO)
app.get("/checkins", (req, res) => {
  db.query("SELECT * FROM checkin", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.listen(3000, () => console.log("Server berjalan di port 3000"));

