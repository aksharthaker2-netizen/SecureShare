import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import verifyToken from "../middleware/authMiddleware.js";
import db from "../config/db.js";
import fs from "fs";

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
export default router;