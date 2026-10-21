# AppointEase — Appointment Management System

AppointEase is a full-stack web application that makes appointment booking and management simple. Customers can book and cancel appointments, while administrators can securely manage appointment statuses.

## Features

- Book appointments through the web interface.
- View existing appointment records.
- Cancel appointments.
- Secure admin login using JWT authentication.
- Admin dashboard to review bookings.
- Update appointment statuses: pending, confirmed, and completed.
- Responsive user interface.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Bootstrap
- Lucide React

### Backend
- Node.js
- Express.js
- REST API
- JSON Web Token (JWT) authentication

### Database
- MySQL

## Project Structure

```text
AppointEase/
├── frontend/
│   └── src/
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/tulseepatle430-pixel/AppointEase.git
cd AppointEase
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder. Add your own local MySQL credentials and authentication secrets, using the exact environment variable names expected by your backend code.

Do not upload `.env` to GitHub.

### 3. Start the backend

Run the start command configured in `backend/package.json`. For example:

```bash
npm start
```

If your package uses a development script instead, run `npm run dev`.

The backend normally runs at `http://localhost:5000`.

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend status |
| GET | `/api/services` | Retrieve available services |
| GET | `/api/appointments` | Retrieve appointment records |
| POST | `/api/appointments` | Book an appointment |
| PATCH | `/api/appointments/:id/cancel` | Cancel an appointment |
| POST | `/api/admin/login` | Authenticate an administrator |
| PATCH | `/api/appointments/:id/status` | Update appointment status with admin authentication |

## Security Notes

- Keep database credentials and JWT secrets in the local `.env` file.
- Never commit passwords, authentication tokens, or other secrets.
- Admin-only endpoints require valid authentication.

## Future Improvements

- Customer accounts and appointment history.
- Email notifications and reminders.
- Appointment search and filtering.
- Deployment to a cloud hosting platform.

## Author

**Tulsee Patle**

- GitHub: [tulseepatle430-pixel](https://github.com/tulseepatle430-pixel)
- Project: [AppointEase](https://github.com/tulseepatle430-pixel/AppointEase)
