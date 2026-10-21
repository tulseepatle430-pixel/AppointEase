
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Import routes
const servicesRoute = require("./routes/services");
const appointmentsRoute = require("./routes/appointments");
const adminRoute = require("./routes/admin");

// Register routes
app.use("/api/services", servicesRoute);
app.use("/api/appointments", appointmentsRoute);
app.use("/api/admin", adminRoute);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to AppointEase API!",
    status: "Server is running",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AppointEase backend is working!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `AppointEase server running at http://localhost:${PORT}`
  );
});
