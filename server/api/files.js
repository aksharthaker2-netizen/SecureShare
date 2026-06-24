import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import verifyToken from "../middleware/authMiddleware.js";
import db from "../config/db.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

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
      "SELECT files.*, COALESCE(SUM(shared_files.view_count),0) AS total_views FROM files LEFT JOIN shared_files ON files.id = shared_files.file_id WHERE uploaded_by = ? GROUP BY files.id";

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
router.delete(
  "/delete/:id",
  verifyToken,
  (req, res) => {

    const fileId = req.params.id;

    const findSql =
      "SELECT * FROM files WHERE id = ?";

    db.query(
      findSql,
      [fileId],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "File not found",
          });
        }

        const file = result[0];

        if (file.uploaded_by !== req.user.id) {
          return res.status(403).json({
            message: "Unauthorized",
          });
        }

        fs.unlink(
          file.filepath,
          (err) => {

            if (err) {
              console.log(err);
            }

            const deleteSql =
              "DELETE FROM files WHERE id = ?";

            db.query(
              deleteSql,
              [fileId],
              (err) => {

                if (err) {
                  return res.status(500).json({
                    message: "Delete failed",
                  });
                }

                res.json({
                  message: "File deleted successfully",
                });
              }
            );
          }
        );
      }
    );
  }
);
router.post(
  "/share/:id",
  verifyToken,
  (req, res) => {

    const fileId = req.params.id;

    const sql =
      "SELECT * FROM files WHERE id = ?";

    db.query(
      sql,
      [fileId],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "File not found",
          });
        }

        const file = result[0];

        if (file.uploaded_by !== req.user.id) {
          return res.status(403).json({
            message: "Unauthorized",
          });
        }

        const token = uuidv4();

        const insertSql =
          "INSERT INTO shared_files (file_id, share_token) VALUES (?, ?)";

        db.query(
          insertSql,
          [fileId, token],
          (err) => {

            if (err) {
              return res.status(500).json({
                message: "Share failed",
              });
            }

            res.json({
              shareUrl:
                `http://localhost:5173/share/${token}`
            });
          }
        );
      }
    );
  }
);
router.get(
  "/stats",
  verifyToken,
  (req, res) => {

    const userId = req.user.id;

    const sql = `
      SELECT
      COUNT(DISTINCT files.id)
      AS total_files,

      COALESCE(
      SUM(shared_files.view_count),
      0
      ) AS total_views,

      COALESCE(
      SUM(shared_files.download_count),
      0
      ) AS total_downloads

      FROM files

      LEFT JOIN shared_files
      ON files.id =
      shared_files.file_id

      WHERE files.uploaded_by = ?
    `;

    db.query(
      sql,
      [userId],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.json(result[0]);
      }
    );
  }
);
export default router;