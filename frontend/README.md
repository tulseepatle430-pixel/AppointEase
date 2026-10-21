# AppointEase — Appointment Management System

AppointEase is a full-stack web application designed to simplify appointment booking and management. Customers can book appointments and cancel existing bookings, while administrators can view appointments and update their statuses through a dedicated dashboard.

## Features

- **Appointment Booking:** Book appointments through an interactive interface.
- **Appointment Cancellation:** Cancel existing appointments.
- **Admin Authentication:** Secure admin login using server-side credential validation and JWT authentication.
- **Admin Dashboard:** View appointment records and their details.
- **Status Management:** Administrators can update eligible appointments to Pending, Confirmed, or Completed.
- **Database Integration:** Store and retrieve application data using MySQL.
- **Responsive Interface:** A React-based user interface with reusable components.
- **API Integration:** Connect the frontend to the backend through REST API endpoints.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server and build tool |
| CSS | Styling and responsive layouts |
| Bootstrap | UI styling utilities |
| Lucide React | Icons |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API and routing |
| MySQL | Relational database |
| JSON Web Token (JWT) | Admin authentication |
| Git and GitHub | Version control and source code hosting |

## Project Structure

```text
AppointEase/
├── backend/
│   ├── middleware/
│   │   └── adminAuth.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── appointments.js
│   │   └── services.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Appointments.jsx
│   │   └── Appointments.css
│   ├── index.html
│   └── package.json
└── README.md
```

> The `.env` file is local configuration and must not be uploaded to GitHub.

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- Git
- A code editor such as Visual Studio Code

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tulseepatle430-pixel/AppointEase.git
cd AppointEase
```

### 2. Configure the MySQL database

Start MySQL and create the application database:

```sql
CREATE DATABASE appoint_ease;
```

Make sure the required tables and relationships are created according to the backend queries. Configure the database connection in `backend/.env` using the variable names expected by `backend/db.js`.

### 3. Configure environment variables

Create a local `.env` file inside the `backend` directory. Add the required database configuration and admin authentication settings.

Example template — replace the database variable names with those used by your `backend/db.js` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=appoint_ease

JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@appoint-ease.com
ADMIN_PASSWORD=replace_with_a_strong_unique_password
```

**Security:** Use your own credentials, keep `.env` private, and never commit real passwords or JWT secrets.

### 4. Install and run the backend

Open a terminal in the project root:

```bash
cd backend
npm install
npm start
```

If the backend package does not define a `start` script, use the development command configured in `backend/package.json`, such as `npm run dev`.

The backend is configured to run on:

`http://localhost:5000`

Check the health endpoint:

`http://localhost:5000/api/health`

### 5. Install and run the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, typically:

`http://localhost:5173`

Keep both frontend and backend terminals running while testing the application.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/services` | Retrieve services |
| GET | `/api/appointments` | Retrieve appointment records |
| POST | `/api/appointments` | Create an appointment |
| PATCH | `/api/appointments/:id/cancel` | Cancel an appointment |
| POST | `/api/admin/login` | Authenticate an administrator |
| PATCH | `/api/appointments/:id/status` | Update appointment status with admin authentication |

The status update endpoint requires a valid admin JWT in the `Authorization: Bearer <token>` header.

## Screenshots

Add screenshots of your running application to a `screenshots/` folder in the project root.

Suggested screenshots:

1. Homepage — `screenshots/homepage.png`
2. Appointment booking — `screenshots/booking.png`
3. Admin login — `screenshots/admin-login.png`
4. Admin dashboard — `screenshots/admin-dashboard.png`

Once you have added the images, embed them below using Markdown:

```markdown
### Homepage
![AppointEase Homepage](screenshots/homepage.png)

### Appointment Booking
![Appointment Booking](screenshots/booking.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
```

Only add screenshots that actually exist in the repository.

## Future Improvements

- Customer registration and login
- Improved appointment scheduling and availability management
- Additional validation and error handling
- Deployment with a hosted database
- Automated testing

## Author

**Tulsee Patle**

- GitHub: [tulseepatle430-pixel](https://github.com/tulseepatle430-pixel)
- Project Repository: [AppointEase](https://github.com/tulseepatle430-pixel/AppointEase)

---

*AppointEase — Making appointment management simpler.*
