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

router.get("/user-photo", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const result = await db.query(
      "SELECT name, firstname, photo FROM EMPLOYEE WHERE id_employee = $1",
      [decoded.id]
    );
    const user = result.rows[0];

    if (!user || !user.photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Convert bytea data to base64
    const base64Photo = Buffer.from(user.photo).toString("base64");

    res.json({
      firstname: user.name,
      surname: user.firstname,
      photo: base64Photo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user-details", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const result = await db.query(
      "SELECT username FROM EMPLOYEE WHERE id_employee = $1",
      [decoded.id]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username });
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
        { id: user.id_employee, username: user.username },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );
      res.json({ token, userId: user.id_employee }); // Ensure this field exists and is correctly referenced
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
  const { email } = req.body;
  console.log(req.body);

  try {
    const result = await db.query(
      "SELECT * FROM EMPLOYEE WHERE pro_email_address = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(recoveryCode, 10);

    await db.query(
      "UPDATE EMPLOYEE SET RECOVERY_CODE = $1 WHERE pro_email_address = $2",
      [hashedCode, email]
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      from: process.env.OUTLOOK_USER,
      to: user.pro_email_address,
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
  const { recoveryCode, email } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM EMPLOYEE WHERE PRO_EMAIL_ADDRESS = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.recovery_code) {
      return res
        .status(400)
        .json({ error: "Recovery code is not set for this user" });
    }

    const isCodeValid = await bcrypt.compare(recoveryCode, user.recovery_code);
    if (!isCodeValid) {
      return res.status(401).json({ error: "Invalid recovery code" });
    }

    res.json({ message: "Recovery code valid" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset Password Endpoint
router.post("/reset-password", async (req, res) => {
  const { newPassword, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE EMPLOYEE SET PASSWORD = $1, RECOVERY_CODE = NULL WHERE PRO_EMAIL_ADDRESS = $2",
      [hashedPassword, email]
    );
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
