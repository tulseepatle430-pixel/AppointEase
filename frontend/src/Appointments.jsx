
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  RefreshCw,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import "./Appointments.css";

function Appointments({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  async function fetchAppointments() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load appointments."
        );
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function cancelAppointment(appointmentId) {
    const confirmed = window.confirm(
      `Are you sure you want to cancel appointment #${appointmentId}?`
    );

    if (!confirmed) return;

    setCancellingId(appointmentId);
    setActionMessage("");
    setActionError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel appointment."
        );
      }

      setActionMessage(data.message);
      await fetchAppointments();
    } catch (err) {
      setActionError(
        err.message || "Unable to cancel appointment."
      );
    } finally {
      setCancellingId(null);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Date unavailable";

    const date = new Date(
      `${String(dateValue).slice(0, 10)}T12:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(timeValue) {
    if (!timeValue) return "Time unavailable";

    const parts = String(timeValue).slice(0, 5).split(":");
    const hours = Number(parts[0]);
    const minutes = parts[1];

    if (Number.isNaN(hours) || !minutes) {
      return String(timeValue);
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${String(displayHours).padStart(2, "0")}:${minutes} ${period}`;
  }

  return (
    <main className="appointments-page">
      <div className="appointments-header">
        <div>
          <p className="appointments-eyebrow">APPOINTEASE</p>
          <h1>My Appointments</h1>
          <p className="appointments-subtitle">
            View and manage your scheduled appointments.
          </p>
        </div>

        <div className="appointments-actions">
          <button
            className="appointments-button secondary"
            onClick={fetchAppointments}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            className="appointments-button"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Home
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="appointments-success" role="status">
          {actionMessage}
        </div>
      )}

      {actionError && (
        <div className="appointments-error" role="alert">
          {actionError}
        </div>
      )}

      {loading && (
        <p className="appointments-message">
          Loading appointments...
        </p>
      )}

      {error && (
        <div className="appointments-error" role="alert">
          <p>{error}</p>
          <button
            className="appointments-button"
            onClick={fetchAppointments}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="appointments-empty">
          <CalendarDays size={42} />
          <h2>No appointments yet</h2>
          <p>Your bookings will appear here.</p>
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <>
          <div className="appointments-count">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""} found
          </div>

          <div className="appointments-grid">
            {appointments.map((appointment) => {
              const status = String(
                appointment.status || "pending"
              ).toLowerCase();

              const canCancel =
                status !== "cancelled" &&
                status !== "completed";

              return (
                <article
                  className="appointment-card"
                  key={appointment.id}
                >
                  <div className="appointment-card-top">
                    <span className="appointment-card-icon">
                      <CalendarDays size={22} />
                    </span>

                    <span
                      className={`appointment-status ${status}`}
                    >
                      {status}
                    </span>
                  </div>

                  <h2>{appointment.service_name}</h2>

                  <p className="appointment-provider">
                    Professional:{" "}
                    {appointment.provider_name || "Not assigned"}
                  </p>

                  <div className="appointment-detail">
                    <CalendarDays size={17} />
                    <span>
                      {formatDate(appointment.appointment_date)}
                    </span>
                  </div>

                  <div className="appointment-detail">
                    <Clock3 size={17} />
                    <span>
                      {formatTime(appointment.appointment_time)}
                    </span>
                  </div>

                  <div className="appointment-customer">
                    <strong>{appointment.user_name}</strong>
                    <span>{appointment.user_email}</span>
                  </div>

                  {appointment.reason && (
                    <p className="appointment-reason">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  )}

                  <p className="appointment-booking-id">
                    Booking ID: #{appointment.id}
                  </p>

                  {canCancel && (
                    <button
                      className="appointment-cancel-button"
                      onClick={() =>
                        cancelAppointment(appointment.id)
                      }
                      disabled={cancellingId === appointment.id}
                    >
                      <XCircle size={17} />
                      {cancellingId === appointment.id
                        ? "Cancelling..."
                        : "Cancel Appointment"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

export default Appointments;
