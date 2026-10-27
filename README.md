# 🍿 iMovies - Movie Ticket Booking Platform

> **Movie ticket booking made simple.** A production-ready, full-stack, responsive Movie Ticket Booking platform built with React (Vite), Express.js, MongoDB (Mongoose), Socket.IO, Razorpay Payment Gateway (Test Mode), Nodemailer, and Node-cron — styled with an **Amazon Prime Video-inspired modern UI design system**.

---

## 🚀 Key Features

1. **Amazon Prime Video-Inspired UI & Design System**:
   - Deep midnight navy base palette (`#0A0E17` / `#0F172A`) replacing generic dark backgrounds.
   - Vibrant electric cyan & Prime blue accents (`#00A8E1` / `#00509D`) for interactive CTAs, tab indicators, and active badges.
   - Dark translucent slate blue panels (`#131B2E`) with smooth scale/glow hover transitions.
   - Code-splitted React Router DOM with `React.lazy` and `Suspense`.
   - Responsive across mobile, tablet, and desktop viewports.
   - Toast feedback with `react-toastify` and celebratory confetti with `canvas-confetti`.

2. **Real-Time Seat Locking Mechanism (TTL)**:
   - When users select seats, a 10-minute temporary lock (TTL) is placed across all clients.
   - Instant bi-directional status updates via **Socket.IO** (`seats_locked`, `seats_released`, `seats_booked`, `seats_auto_released`).
   - Automated background cleanup via `cleanupService.js` and `node-cron`.

3. **Razorpay Test-Mode Payment Gateway (5-Step Transaction Flow)**:
   - Supports **UPI** (Google Pay, PhonePe, Paytm, QR Codes), Credit/Debit Cards, NetBanking, and Wallets.
   - Cryptographic **HMAC-SHA256 signature verification** on the backend.
   - Test Key ID: `rzp_test_TpQ7mg5jyDRTt0`
   - Test Key Secret: `5OtY3b29pz3FK1KukmSiZqmS`

4. **Nodemailer Automated Email Tickets & Cron Reminders**:
   - Sends beautifully formatted HTML movie tickets directly upon payment verification.
   - Scheduled hourly reminders via `node-cron` and `reminderService.js`.

5. **1-Click WhatsApp Ticket Sharing**:
   - Formats booking information into an emoji-rich message (`https://wa.me/?text=...`) for instant sharing to friends and family.

6. **Admin Dashboard & Razorpay Refund Management**:
   - Real-time revenue analytics, bookings ledger, and cinema management.
   - Dedicated **Transactions & Refund Panel** (`GET /api/admin/transactions` & `POST /api/admin/refund/:paymentId`).
   - Calling refund instantly updates booking status to `Refunded` and frees up the booked seats.

---

## 📁 Project Architecture

```
iMovies/
├── client/                     # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/         # Header, Footer, Loader, MovieCard, AdminTransactions, UserProtection, AdminProtection
│   │   ├── context/            # AuthContext.jsx
│   │   ├── hooks/              # useFetch.js
│   │   ├── pages/              # Landing, Login, Register, Home, MovieDetails, MovieShows, SeatSlug, Bookings, FavoriteShows, Profile, AdminDashboard, AddMovie, AddTheatre, AddShow, AddAdmin, AdminBookings
│   │   ├── utils/              # api.js, whatsappHelper.js
│   │   ├── App.jsx             # React Router config with Suspense & Lazy loading
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html              # Razorpay Checkout v1 script
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── server/                     # Backend (Node + Express)
    ├── controllers/            # Auth, Movies, Shows, Theatres, Bookings, Payment, Admin, Favorite, Review
    ├── middlewares/            # fetchUser.js (JWT validation), adminAuth.js
    ├── models/                 # userModel, adminModel, movieModel, theatreModel, showModel, bookingModel, paymentModel, favoriteModel, reviewModel
    ├── routes/                 # Express REST API routes mounted under /api
    ├── services/               # emailService.js, cleanupService.js, reminderService.js
    ├── utils/                  # seedData.js, mailer.js
    ├── server.js               # Express + Socket.IO entry point
    └── .env                    # Environment credentials
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@imovies.com` | `user123` | Now Showing, Seat Reservation, Digital Tickets, Watchlist |
| **Administrator** | `admin@imovies.com` | `admin123` | Admin Dashboard, Add Movie/Theatre/Show, Refunds & Analytics |

*(Pre-fill buttons are also available on the `/login` page for 1-click access!)*

---

## ⚙️ Environment Variables Template (`server/.env`)

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026
RAZORPAY_KEY_ID=rzp_test_TpQ7mg5jyDRTt0
RAZORPAY_KEY_SECRET=5OtY3b29pz3FK1KukmSiZqmS
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

*(Note: If local MongoDB is not running, the server automatically starts an isolated in-memory MongoDB instance with pre-seeded blockbusters and luxury cinema halls!)*

---

## 🏃 Running the Application

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5050` with WebSocket support.*

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*Client opens on `http://localhost:5173` with Vite Hot Module Replacement.*

---

## 🧪 Verification & Automated Tests
A full integration test suite testing all 12 key endpoints (Auth, Movies, Shows, Live Lock, Razorpay Order, HMAC Verification, Email Dispatch, and Admin Refund) can be executed at any time:
```bash
cd server
node test-verification.js
```
