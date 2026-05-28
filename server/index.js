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

app.get("/", (req, res) => {
  res.send("SecureShare Backend Running");
});

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