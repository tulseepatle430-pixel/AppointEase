

const express = require("express");
const router = express.Router();
const db = require("../db");

// ========================================
// 1. GET ALL APPOINTMENTS
// ========================================
router.get("/", async (req, res) => {
  try {
    const [appointments] = await db.query(`
      SELECT
        a.id,
        u.name AS user_name,
        u.email AS user_email,
        s.name AS service_name,
        p.name AS provider_name,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      JOIN providers p ON a.provider_id = p.id
      ORDER BY a.appointment_date, a.appointment_time
    `);

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch appointments.",
    });
  }
});

// ========================================
// 2. BOOK A NEW APPOINTMENT
// ========================================
router.post("/", async (req, res) => {
  const {
    name,
    email,
    service,
    date,
    time,
    reason,
  } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !service ||
    !date ||
    !time
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields.",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Find or create the guest user
    const [existingUsers] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    let userId;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;

      await connection.query(
        "UPDATE users SET name = ? WHERE id = ?",
        [name.trim(), userId]
      );
    } else {
      const [userResult] = await connection.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES (?, ?, NULL)`,
        [name.trim(), email.trim().toLowerCase()]
      );

      userId = userResult.insertId;
    }

    // Find the selected service
    const [services] = await connection.query(
      "SELECT id FROM services WHERE name = ?",
      [service]
    );

    if (services.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Selected service was not found.",
      });
    }

    // Find a provider for the selected service
    const [providers] = await connection.query(
      `SELECT id
       FROM providers
       WHERE specialty = ?
       ORDER BY id
       LIMIT 1`,
      [service]
    );

    if (providers.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "No provider is available for this service yet.",
      });
    }

    // Convert website time to MySQL TIME format
    const timeMap = {
      "09:00 AM": "09:00:00",
      "10:00 AM": "10:00:00",
      "11:00 AM": "11:00:00",
      "12:00 PM": "12:00:00",
      "02:00 PM": "14:00:00",
      "03:00 PM": "15:00:00",
      "04:00 PM": "16:00:00",
    };

    const appointmentTime = timeMap[time];

    if (!appointmentTime) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Please select a valid appointment time.",
      });
    }

    // Insert appointment
    const [result] = await connection.query(
      `INSERT INTO appointments
       (
         user_id,
         provider_id,
         service_id,
         appointment_date,
         appointment_time,
         reason
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        providers[0].id,
        services[0].id,
        date,
        appointmentTime,
        reason?.trim() || null,
      ]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointment_id: result.insertId,
    });
  } catch (error) {
    await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    console.error("Booking error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to book appointment. Please try again.",
    });
  } finally {
    connection.release();
  }
});

// ========================================
// 3. CANCEL AN APPOINTMENT
// PATCH /api/appointments/:id/cancel
// ========================================
router.patch("/:id/cancel", async (req, res) => {
  const appointmentId = Number(req.params.id);

  // Validate appointment ID
  if (
    !Number.isInteger(appointmentId) ||
    appointmentId <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID.",
    });
  }

  try {
    // Check whether the appointment exists
    const [appointments] = await db.query(
      "SELECT id, status FROM appointments WHERE id = ?",
      [appointmentId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const appointment = appointments[0];

    // Prevent cancelling an already-cancelled appointment
    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This appointment is already cancelled.",
      });
    }

    // Prevent cancelling a completed appointment
    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "A completed appointment cannot be cancelled.",
      });
    }

    // Update status instead of deleting the record
    await db.query(
      `UPDATE appointments
       SET status = 'cancelled'
       WHERE id = ?`,
      [appointmentId]
    );

    return res.json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment_id: appointmentId,
      status: "cancelled",
    });
  } catch (error) {
    console.error("Cancellation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel appointment. Please try again.",
    });
  }
});

/* ========================================
   4. ADMIN-ONLY: UPDATE APPOINTMENT STATUS
   PATCH /api/appointments/:id/status
======================================== */

const adminAuth = require("../middleware/adminAuth");

router.patch("/:id/status", adminAuth, async (req, res) => {
  const appointmentId = Number(req.params.id);
  const { status } = req.body;

  // Validate appointment ID
  if (
    !Number.isInteger(appointmentId) ||
    appointmentId <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID.",
    });
  }

  // Only these status updates are allowed through this endpoint
  const allowedStatuses = ["pending", "confirmed", "completed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid status. Use pending, confirmed, or completed.",
    });
  }

  try {
    const [appointments] = await db.query(
      "SELECT id, status FROM appointments WHERE id = ?",
      [appointmentId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const currentStatus = appointments[0].status;

    // A cancelled appointment cannot be reopened through this endpoint
    if (currentStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "A cancelled appointment cannot be updated.",
      });
    }

    await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, appointmentId]
    );

    return res.json({
      success: true,
      message: "Appointment status updated successfully.",
      appointment_id: appointmentId,
      status,
    });
  } catch (error) {
    console.error("Status update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update appointment status.",
    });
  }
});

module.exports = router;
