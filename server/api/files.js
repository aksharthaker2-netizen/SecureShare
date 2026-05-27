import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import verifyToken from "../middleware/authMiddleware.js";
import db from "../config/db.js";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const sql =
      "INSERT INTO files (filename, filepath, uploaded_by) VALUES (?, ?, ?)";

    db.query(
      sql,
      [
        req.file.filename,
        req.file.path,
        req.user.id,
      ],
      (err, result) => {

        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Database error",
          });
        }

        res.status(200).json({
          message: "File uploaded successfully",
          file: req.file,
        });
      }
    );
  }
);

router.get(
  "/myfiles",
  verifyToken,
  (req, res) => {

    const sql =
      "SELECT * FROM files WHERE uploaded_by = ?";

    db.query(
      sql,
      [req.user.id],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.status(200).json(result);
      }
    );
  }
);

export default router;