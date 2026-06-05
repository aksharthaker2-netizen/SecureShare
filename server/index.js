import express from "express";
import cors from "cors";
import db from "./config/db.js";
import authRoutes from "./api/auth.js";
import dotenv from "dotenv";
import verifyToken from "./middleware/authMiddleware.js";
import fileRoutes from "./api/files.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.send("SecureShare Backend Running");
});
app.get(
  "/api/share/:token",
  (req, res) => {

    const token = req.params.token;

    const sql = `
      SELECT files.*
      FROM shared_files
      JOIN files
      ON shared_files.file_id = files.id
      WHERE shared_files.share_token = ?
    `;

    db.query(
      sql,
      [token],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "Invalid share link",
          });
        }

        res.json(result[0]);
      }
    );
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get(
  "/api/protected",
  verifyToken,
  (req, res) => {

    res.json({
      message: "Protected route accessed",
      user: req.user,
    });
  }
);