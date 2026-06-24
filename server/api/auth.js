import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    db.query(
      sql,
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "User creation failed",
          });
        }

        res.status(201).json({
          message: "User created successfully",
        });
      }
    );
  } catch (error) {
    ;

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Server error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  });
});

router.post(
  "/forgot-password",
  (req, res) => {

    const { email } = req.body;

    const sql = `
      SELECT *
      FROM users
      WHERE email = ?
    `;

    db.query(
      sql,
      [email],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        const user =
          result[0];

        const resetToken =
          crypto.randomBytes(32)
          .toString("hex");

        const expiresAt =
          new Date(
            Date.now()
            + 3600000
          );

        const insertSql = `
          INSERT INTO password_resets
          (
            user_id,
            reset_token,
            expires_at
          )
          VALUES (?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            user.id,
            resetToken,
            expiresAt
          ],
          (err) => {

            if (err) {
              return res.status(500).json({
                message: "Database error",
              });
            }

            res.json({
              message:
                "Reset token generated",
              resetToken,
            });

          }
        );

      }
    );
  }
);
router.post(
  "/reset-password",
  async (req, res) => {

    const {
      token,
      password
    } = req.body;

    const sql = `
      SELECT *
      FROM password_resets
      WHERE reset_token = ?
    `;

    db.query(
      sql,
      [token],
      async (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            message: "Invalid token",
          });
        }

        const reset =
          result[0];

        if (
          new Date() >
          new Date(reset.expires_at)
        ) {
          return res.status(400).json({
            message: "Token expired",
          });
        }

        const hashedPassword =
          await bcrypt.hash(
            password,
            10
          );

        const updateSql = `
          UPDATE users
          SET password = ?
          WHERE id = ?
        `;

        db.query(
          updateSql,
          [
            hashedPassword,
            reset.user_id
          ],
          (err) => {

            if (err) {
              return res.status(500).json({
                message:
                  "Database error",
              });
            }

            const deleteSql = `
              DELETE FROM password_resets
              WHERE id = ?
            `;

            db.query(
              deleteSql,
              [reset.id]
            );

            res.json({
              message:
                "Password reset successful",
            });
          }
        );
      }
    );
  }
);

export default router;