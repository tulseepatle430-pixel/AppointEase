
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function AdminDashboard({ token, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadAppointments() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/appointments`);
      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to load appointments.");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function updateStatus(id, status) {
    setUpdatingId(id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Status update failed.");
      }

      setMessage(`Appointment #${id} updated to ${status}.`);
      await loadAppointments();
    } catch (err) {
      setError(err.message || "Unable to update appointment.");
    } finally {
      setUpdatingId(null);
    }
  }

  const statusClass = (status) =>
    `status-badge status-${(status || "pending").toLowerCase()}`;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-logo">
            <ShieldCheck size={25} />
          </span>
          <div>
            <h1>AppointEase Admin</h1>
            <p>Appointment Management</p>
          </div>
        </div>

        <button className="admin-logout" onClick={onLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <section className="admin-content">
        <div className="admin-title-row">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION</p>
            <h2>Appointments</h2>
            <p className="admin-subtitle">
              Review bookings and manage their status.
            </p>
          </div>

          <button
            className="admin-refresh"
            onClick={loadAppointments}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="admin-stats">
          <div className="admin-stat">
            <CalendarDays />
            <span>Total appointments</span>
            <strong>{appointments.length}</strong>
          </div>

          <div className="admin-stat">
            <Clock />
            <span>Pending</span>
            <strong>
              {appointments.filter((a) => a.status === "pending").length}
            </strong>
          </div>

          <div className="admin-stat">
            <CheckCircle2 />
            <span>Confirmed</span>
            <strong>
              {appointments.filter((a) => a.status === "confirmed").length}
            </strong>
          </div>
        </div>

        {error && <div className="admin-alert error">{error}</div>}
        {message && <div className="admin-alert success">{message}</div>}

        <section className="admin-table-card">
          <div className="admin-table-heading">
            <h3>All bookings</h3>
            <span>{appointments.length} records</span>
          </div>

          {loading ? (
            <p className="admin-empty">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p className="admin-empty">No appointments found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date & time</th>
                    <th>Status</th>
                    <th>Update status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>#{appointment.id}</td>
                      <td>
                        <strong>{appointment.user_name || "Customer"}</strong>
                        <small>{appointment.user_email || ""}</small>
                      </td>
                      <td>{appointment.service_name || "—"}</td>
                      <td>
                        {appointment.appointment_date || "—"}
                        <small>{appointment.appointment_time || ""}</small>
                      </td>
                      <td>
                        <span className={statusClass(appointment.status)}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        {appointment.status === "cancelled" ? (
                          <span className="admin-locked">
                            <XCircle size={15} />
                            Cancelled
                          </span>
                        ) : appointment.status === "completed" ? (
                          <span className="admin-locked">
                            <CheckCircle2 size={15} />
                            Completed
                          </span>
                        ) : (
                          <select
                            className="admin-status-select"
                            value={appointment.status}
                            disabled={updatingId === appointment.id}
                            onChange={(event) =>
                              updateStatus(
                                appointment.id,
                                event.target.value
                              )
                            }
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;
