
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all services
router.get("/", async (req, res) => {
  try {
    const [services] = await db.query(
      "SELECT * FROM services ORDER BY id ASC"
    );

    res.json({
      success: true,
      count: services.length,
      services: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch services",
    });
  }
});

module.exports = router;
