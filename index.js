const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors middleware
const userRoutes = require("./routes/userRoutes");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Simple root route
app.get("/", (req, res) => {
  res.send("Welcome to the User Management API");
});

// Use the user routes
app.use("/api", userRoutes);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
    },
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
