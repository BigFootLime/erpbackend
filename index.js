const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const clientRoutes = require("./routes/clientRoutes");
const devisRoutes = require("./routes/devisRoutes");
const userRoutes = require("./routes/userRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to compress responses
app.use(compression());

// Security middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
    },
  })
);

// Simple root route
app.get("/", (req, res) => {
  res.send("Welcome to the User Management API");
});

// Use the client and devis routes
app.use("/api", clientRoutes);
app.use("/api", devisRoutes);
app.use("/api", userRoutes);
app.use("/api", supplierRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
