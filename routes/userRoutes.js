const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM EMPLOYEE");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to create a new user
router.post("/users", async (req, res) => {
  const { username, password, email, firstName, lastName, role, status } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO EMPLOYEE (username, password_hash, email, first_name, last_name, role, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [username, hashedPassword, email, firstName, lastName, role, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM EMPLOYEE WHERE USERNAME = $1",
      [username]
    );
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//**********************************************RESET PASSWORD SECTION************************************************* */
router.post("/request-password-reset", async (req, res) => {
  const { username } = req.body;
  console.log("username", username);
  try {
    const result = await db.query(
      "SELECT * FROM EMPLOYEE WHERE USERNAME = $1",
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recoveryCode = crypto.randomBytes(20).toString("hex");
    const hashedCode = await bcrypt.hash(recoveryCode, 10);

    await db.query(
      "UPDATE EMPLOYEE SET RECOVERY_CODE = $1 WHERE USERNAME = $2",
      [hashedCode, username]
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "GMAIL",
      auth: {
        user: "kesmartin2004@gmail.com",
        pass: "itsbiggerontheinside",
      },
    });

    const mailOptions = {
      from: "kesmartin2004@gmail.com",
      to: user.PRO_EMAIL_ADDRESS,
      subject: "Password Recovery",
      text: `Your recovery code is: ${recoveryCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Recovery email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-recovery-code", async (req, res) => {
  const { username, recoveryCode } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM EMPLOYEE WHERE USERNAME = $1",
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isCodeValid = await bcrypt.compare(recoveryCode, user.RECOVERY_CODE);
    if (!isCodeValid) {
      return res.status(401).json({ error: "Invalid recovery code" });
    }

    res.json({ message: "Recovery code valid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE EMPLOYEE SET PASSWORD = $1, RECOVERY_CODE = NULL WHERE USERNAME = $2",
      [hashedPassword, username]
    );
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
