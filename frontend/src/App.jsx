
    import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  UserRound,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  BriefcaseBusiness,
  GraduationCap,
  Heart,
  Menu,
  X,
} from "lucide-react";
import Appointments from "./Appointments";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

const services = [
  {
    icon: Stethoscope,
    title: "Healthcare",
    description: "Book appointments with healthcare professionals.",
    color: "#e8f1ff",
  },
  {
    icon: BriefcaseBusiness,
    title: "Consultation",
    description: "Get guidance from experienced professionals.",
    color: "#e9f9f0",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Plan a session to discuss your learning goals.",
    color: "#fff1df",
  },
];

const bookingServices = [
  "General Consultation",
  "Health Consultation",
  "Career Counselling",
  "Technical Support",
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    date: "",
    time: "",
    reason: "",
  });

  const today = new Date();

  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  function openBooking() {
    setSubmitted(false);
    setBookingMessage("");
    setBookingError("");
    setBookingOpen(true);
    setMenuOpen(false);
  }

  function closeBooking() {
    if (submitting) return;

    setBookingOpen(false);
    setBookingError("");
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleBooking(event) {
    event.preventDefault();

    setSubmitting(true);
    setBookingError("");
    setBookingMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            service: formData.service,
            date: formData.date,
            time: formData.time,
            reason: formData.reason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to book your appointment."
        );
      }

      setSubmitted(true);

      setBookingMessage(
        `Appointment booked successfully! Booking ID: ${
          data.appointment_id ?? data.id ?? "Confirmed"
        }`
      );

      setFormData({
        name: "",
        email: "",
        service: "",
        date: "",
        time: "",
        reason: "",
      });
    } catch (error) {
      setBookingError(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (showAppointments) {
    return (
      <Appointments
        onBack={() => setShowAppointments(false)}
      />
    );
  }

if (adminToken) {
  return (
    <AdminDashboard
      token={adminToken}
      onLogout={() => {
        setAdminToken("");
        setShowAdminLogin(false);
      }}
    />
  );
}

if (showAdminLogin) {
  return (
    <AdminLogin
      onLogin={(token) => {
        setAdminToken(token);
        setShowAdminLogin(false);
      }}
      onBack={() => setShowAdminLogin(false)}
    />
  );
}

  return (
    <div className="appoint-ease">
      <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom">
        <div className="container py-2">
          <a
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            href="#home"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-icon">
              <CalendarDays size={23} />
            </span>
            <span>
              Appoint<span className="brand-highlight">Ease</span>
            </span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div
            className={`collapse navbar-collapse ${
              menuOpen ? "show" : ""
            }`}
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <a
                className="nav-link"
                href="#home"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>

              <a
                className="nav-link"
                href="#services"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </a>

              <a
                className="nav-link"
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
              >
                How It Works
              </a>

              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => {
                  setShowAppointments(true);
                  setMenuOpen(false);
                }}
              >
                My Appointments
              </button>

              <button
                type="button"
                className="btn btn-outline-dark rounded-pill px-4"
                onClick={() => {
                  setShowAdminLogin(true);
                  setMenuOpen(false);
                }}
              >
                Admin Login
              </button>

              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={openBooking}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section" id="home">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <span className="hero-badge">
                  <span className="hero-badge-dot" />
                  SIMPLE. SMART. CONVENIENT.
                </span>

                <h1 className="hero-title">
                  Your time matters.
                  <br />
                  <span>Appointments made easy.</span>
                </h1>

                <p className="hero-description">
                  Schedule appointments with ease. Find the right
                  service, choose a convenient time, and manage your
                  bookings in one place.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg rounded-pill px-4"
                    onClick={openBooking}
                  >
                    Book an Appointment
                    <ArrowRight size={18} className="ms-2" />
                  </button>

                  <a
                    href="#services"
                    className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                  >
                    Explore Services
                  </a>
                </div>

                <div className="hero-trust mt-4">
                  <span>
                    <CheckCircle2 size={17} />
                    Easy scheduling
                  </span>
                  <span>
                    <CheckCircle2 size={17} />
                    Convenient booking
                  </span>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="hero-visual-circle" />

                  <div className="appointment-preview">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <p className="preview-label">
                          YOUR SCHEDULE
                        </p>
                        <h3 className="preview-title">
                          Stay on track
                        </h3>
                      </div>

                      <span className="preview-calendar">
                        <CalendarDays size={25} />
                      </span>
                    </div>

                    <div className="preview-date">
                      <span>MON</span>
                      <strong>21</strong>
                      <small>OCT</small>
                    </div>

                    <div className="preview-appointment">
                      <span className="preview-appointment-icon">
                        <Stethoscope size={21} />
                      </span>
                      <div>
                        <strong>Consultation</strong>
                        <p>
                          <Clock3 size={14} />
                          Flexible appointment slots
                        </p>
                      </div>
                      <CheckCircle2
                        size={20}
                        className="text-success ms-auto"
                      />
                    </div>

                    <div className="preview-appointment">
                      <span className="preview-appointment-icon green">
                        <BriefcaseBusiness size={21} />
                      </span>
                      <div>
                        <strong>Professional Guidance</strong>
                        <p>
                          <Clock3 size={14} />
                          Choose your preferred time
                        </p>
                      </div>
                    </div>

                    <div className="preview-footer">
                      <CheckCircle2 size={17} />
                      Everything organized in one place
                    </div>
                  </div>

                  <div className="floating-card floating-card-top">
                    <span className="floating-card-icon">
                      <CalendarDays size={19} />
                    </span>
                    <div>
                      <strong>Easy Booking</strong>
                      <p>Book in a few steps</p>
                    </div>
                  </div>

                  <div className="floating-card floating-card-bottom">
                    <Heart size={20} className="text-danger" />
                    <span>Designed around your time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="container">
            <div className="section-heading text-center">
              <span className="section-eyebrow">OUR SERVICES</span>
              <h2>Appointments for what matters</h2>
              <p>
                Explore our services and schedule a session that
                fits your needs.
              </p>
            </div>

            <div className="row g-4 mt-3">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div className="col-md-4" key={service.title}>
                    <article className="service-card h-100">
                      <div
                        className="service-icon"
                        style={{ backgroundColor: service.color }}
                      >
                        <Icon size={27} />
                      </div>

                      <h3>{service.title}</h3>
                      <p>{service.description}</p>

                      <button
                        type="button"
                        className="service-link"
                        onClick={openBooking}
                      >
                        Book a session
                        <ArrowRight size={17} />
                      </button>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="how-section"
          id="how-it-works"
        >
          <div className="container">
            <div className="section-heading text-center">
              <span className="section-eyebrow">
                HOW IT WORKS
              </span>
              <h2>Three simple steps</h2>
              <p>
                Get your appointment scheduled without unnecessary
                complications.
              </p>
            </div>

            <div className="row g-4 mt-3">
              <div className="col-md-4">
                <div className="step-card">
                  <span className="step-number">01</span>
                  <div className="step-icon">
                    <UserRound size={25} />
                  </div>
                  <h3>Choose a service</h3>
                  <p>
                    Select the type of consultation or support you
                    need.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="step-card">
                  <span className="step-number">02</span>
                  <div className="step-icon">
                    <CalendarDays size={25} />
                  </div>
                  <h3>Select a time</h3>
                  <p>
                    Enter your details and choose an available date
                    and time.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="step-card">
                  <span className="step-number">03</span>
                  <div className="step-icon">
                    <CheckCircle2 size={25} />
                  </div>
                  <h3>Confirm your booking</h3>
                  <p>
                    Submit your booking and review it on the My
                    Appointments page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <div>
                <span className="section-eyebrow">
                  READY WHEN YOU ARE
                </span>
                <h2>Make time for what matters.</h2>
                <p>
                  Schedule your next appointment with AppointEase.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-light btn-lg rounded-pill px-4"
                onClick={openBooking}
              >
                Get Started
                <ArrowRight size={18} className="ms-2" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <a className="footer-brand" href="#home">
            AppointEase
          </a>

          <p className="mb-0">
            Â© {new Date().getFullYear()} AppointEase. All rights
            reserved.
          </p>

          <button
            type="button"
            className="footer-link"
            onClick={() => setShowAppointments(true)}
          >
            My Appointments
          </button>
        </div>
      </footer>

      {bookingOpen && (
        <div
          className="booking-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeBooking();
            }
          }}
        >
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <div className="booking-modal-header">
              <div>
                <span className="section-eyebrow">
                  APPOINTEASE
                </span>
                <h2 id="booking-title">Book an Appointment</h2>
                <p>
                  Fill in your details to schedule your appointment.
                </p>
              </div>

              <button
                type="button"
                className="booking-close"
                aria-label="Close booking form"
                onClick={closeBooking}
                disabled={submitting}
              >
                <X size={22} />
              </button>
            </div>

            {submitted ? (
              <div className="booking-success">
                <CheckCircle2 size={52} />
                <h3>Booking Successful!</h3>
                <p>{bookingMessage}</p>

                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4"
                    onClick={() => {
                      setBookingOpen(false);
                      setSubmitted(false);
                      setShowAppointments(true);
                    }}
                  >
                    View Appointments
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => {
                      setBookingOpen(false);
                      setSubmitted(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                {bookingError && (
                  <div className="alert alert-danger" role="alert">
                    {bookingError}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      className="form-label"
                      htmlFor="booking-name"
                    >
                      Full Name
                    </label>
                    <input
                      id="booking-name"
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      className="form-label"
                      htmlFor="booking-email"
                    >
                      Email Address
                    </label>
                    <input
                      id="booking-email"
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label
                      className="form-label"
                      htmlFor="booking-service"
                    >
                      Select Service
                    </label>
                    <select
                      id="booking-service"
                      className="form-select"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a service</option>
                      {bookingServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label
                      className="form-label"
                      htmlFor="booking-date"
                    >
                      Appointment Date
                    </label>
                    <input
                      id="booking-date"
                      className="form-control"
                      type="date"
                      name="date"
                      min={minimumDate}
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label
                      className="form-label"
                      htmlFor="booking-time"
                    >
                      Appointment Time
                    </label>
                    <select
                      id="booking-time"
                      className="form-select"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Choose a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label
                      className="form-label"
                      htmlFor="booking-reason"
                    >
                      Reason for Appointment (Optional)
                    </label>
                    <textarea
                      id="booking-reason"
                      className="form-control"
                      name="reason"
                      rows="3"
                      placeholder="Briefly describe what you need help with"
                      value={formData.reason}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="booking-form-actions">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={closeBooking}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      "Booking..."
                    ) : (
                      <>
                        Confirm Booking
                        <ArrowRight
                          size={17}
                          className="ms-2"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
