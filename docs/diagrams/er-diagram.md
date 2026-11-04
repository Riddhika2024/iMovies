# 🗄️ iMovies - Entity Relationship (ER) Diagram

This document outlines the database schema architecture and entity relationships for the **iMovies - Movie Ticket Booking Platform**. The database is powered by **MongoDB** with schemas enforced through **Mongoose ODM**.

---

## 1. Visual Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ BOOKING : "places"
    USER ||--o{ PAYMENT : "initiates"
    USER ||--o{ FAVORITE : "saves"
    USER ||--o{ REVIEW : "authors"

    ADMIN ||--o{ SHOW : "schedules"

    MOVIE ||--o{ SHOW : "screened_in"
    MOVIE ||--o{ FAVORITE : "referenced_in"
    MOVIE ||--o{ REVIEW : "evaluated_in"

    THEATRE ||--o{ SHOW : "hosts"

    SHOW ||--o{ BOOKING : "contains"
    BOOKING ||--|| PAYMENT : "settled_by"

    USER {
        ObjectId _id PK
        string username "Unique (3-20 chars)"
        string email "Unique, lowercase"
        string password "Hashed with bcrypt"
        string role "default: user"
        string phone "Contact number"
        date createdAt
        date updatedAt
    }

    ADMIN {
        ObjectId _id PK
        string username "Unique (3-20 chars)"
        string email "Unique, lowercase"
        string password "Hashed with bcrypt"
        string role "default: admin"
        date createdAt
        date updatedAt
    }

    MOVIE {
        ObjectId _id PK
        string movieName "Title (2-200 chars)"
        string description "Synopsis"
        string_array genres "At least 1 genre"
        date releaseDate "Release date"
        string language "Language"
        string duration "Runtime (e.g. 2h 45m)"
        string certification "e.g. UA, A, U"
        string posterUrl "Poster image URL"
        string bannerUrl "Backdrop image URL"
        string trailerUrl "YouTube embed URL"
        string_array cast "Actors list"
        string director "Director name"
        number rating "Score (1.0 - 10.0)"
        date createdAt
        date updatedAt
    }

    THEATRE {
        ObjectId _id PK
        string theatreName "Cinema Hall name"
        string theatreId "Unique code (e.g. THTR-001)"
        string location "City / Mall location"
        number balconySeatPrice "VIP Balcony price"
        number middleSeatPrice "Executive price"
        number lowerSeatPrice "Classic price"
        mixed balconySeats "Row & seat layout"
        mixed middleSeats "Row & seat layout"
        mixed lowerSeats "Row & seat layout"
        date createdAt
        date updatedAt
    }

    SHOW {
        ObjectId _id PK
        string showId "Unique show code"
        string movieId "FK referencing Movie"
        string adminEmail "Creator admin email"
        string theatreName "Cinema complex name"
        string theatreId "Cinema complex code"
        string showDate "Date (YYYY-MM-DD)"
        string showTime "Time (e.g. 02:00 PM)"
        mixed tickets "Seat status map & TTL locks"
        date createdAt
        date updatedAt
    }

    BOOKING {
        ObjectId _id PK
        string bookingId "Unique ticket code (BK-...)"
        string userEmail "Customer email"
        string showId "FK referencing Show"
        string movieTitle "Movie name snapshot"
        string theatreName "Theatre name snapshot"
        string showDate "Show date snapshot"
        string showTime "Showtime snapshot"
        string_array selectedSeats "List of seat IDs"
        mixed ticketsData "Seats breakdown & tiers"
        number totalAmount "Total price in INR"
        string paymentStatus "Pending | Completed | Cancelled | Refunded"
        string orderId "Razorpay order ID"
        string paymentId "Razorpay payment ID"
        string signature "HMAC verification signature"
        string refundId "Razorpay refund ID"
        date refundedAt "Refund timestamp"
        date createdAt
        date updatedAt
    }

    PAYMENT {
        ObjectId _id PK
        string orderId "Unique Razorpay order ID"
        string paymentId "Razorpay payment ID"
        string bookingId "Associated booking code"
        string userEmail "Payer email address"
        number amount "Amount in INR"
        string currency "default: INR"
        string status "created | authorized | captured | refunded | failed"
        string signature "HMAC-SHA256 signature"
        string method "upi / card / netbanking"
        mixed refundDetails "Gateway refund response"
        date createdAt
        date updatedAt
    }

    FAVORITE {
        ObjectId _id PK
        string userEmail "Customer email"
        string movieId "FK referencing Movie"
        date createdAt
        date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        string userEmail "Customer email"
        string username "Display name"
        string movieId "FK referencing Movie"
        number rating "Score (1 - 10)"
        string reviewText "Review commentary"
        date createdAt
        date updatedAt
    }
```

---

## 2. Detailed Schema & Field Specifications

### 2.1 User Entity (`users`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `username` (`String`): Unique handle between 3 and 20 characters.
  - `email` (`String`): Lowercase, validated with standard email RFC regex.
  - `password` (`String`): Hashed via bcrypt with salt rounds of 10.
  - `role` (`String`): Default `"user"`.
  - `phone` (`String`): Optional mobile number for WhatsApp notification fallback.

### 2.2 Admin Entity (`admins`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `username` (`String`): Unique administrator handle.
  - `email` (`String`): Unique administrator email address.
  - `password` (`String`): Securely hashed bcrypt credential.
  - `role` (`String`): Constant `"admin"` checked by `adminAuth.js` middleware.

### 2.3 Movie Entity (`movies`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `movieName` (`String`): Movie title with text index for fast catalog searches.
  - `description` (`String`): Synopsis and storyline.
  - `genres` (`[String]`): Custom validator enforcing at least 1 genre tag.
  - `releaseDate` (`Date`): Theatrical release date.
  - `language` (`String`): Primary audio language (e.g., English, Hindi).
  - `duration` (`String`): Runtime format (`"2h 45m"`).
  - `certification` (`String`): Censor board rating (`"U"`, `"UA"`, `"UA 16+"`, `"A"`).
  - `posterUrl` & `bannerUrl` (`String`): High-resolution promotional visual assets.
  - `rating` (`Number`): Average rating on a 1.0 to 10.0 scale.

### 2.4 Theatre Entity (`theatres`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `theatreName` (`String`): Cinema complex title (e.g., "PVR ICON: Gold Class").
  - `theatreId` (`String`): Unique business identifier (`"THTR-001"`).
  - `location` (`String`): Physical branch/mall location.
  - `balconySeatPrice`, `middleSeatPrice`, `lowerSeatPrice` (`Number`): Dynamic tier pricing in INR.
  - `balconySeats`, `middleSeats`, `lowerSeats` (`Mixed`): Seat matrices defining available rows, columns, and capacity.

### 2.5 Show Entity (`shows`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `showId` (`String`): Unique composite code formatted as:  
    `SHOW-<movieSuffix>-<theatreId>-<YYYY-MM-DD>-<time>`
  - `movieId` (`String`): Hex string referencing the targeted `Movie`.
  - `theatreId` & `theatreName` (`String`): Associated cinema hall.
  - `showDate` (`String`): Date stored as `"YYYY-MM-DD"`.
  - `showTime` (`String`): Showtime (e.g., `"10:30 AM"`, `"06:15 PM"`).
  - `tickets` (`Mixed`): Real-time dictionary tracking every seat code (e.g., `"A1"`, `"C5"`):
    ```json
    {
      "A1": {
        "status": "available",
        "tier": "balcony",
        "price": 450,
        "lockedBy": null,
        "lockExpiresAt": null
      }
    }
    ```

### 2.6 Booking Entity (`bookings`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `bookingId` (`String`): Human-readable reference code (`"BK-XXXXXX-XXX"`).
  - `userEmail` (`String`): Email of the customer who made the reservation.
  - `showId` (`String`): Referenced show code.
  - `selectedSeats` (`[String]`): Array of booked seat identifiers (`["A1", "A2"]`).
  - `totalAmount` (`Number`): Total price in INR.
  - `paymentStatus` (`String`): Enum `['Pending', 'Completed', 'Failed', 'Cancelled', 'Refunded']`.
  - `orderId`, `paymentId`, `signature` (`String`): Cryptographic transaction markers from Razorpay.
  - `refundId` (`String`): Gateway refund transaction ID when refunded.

### 2.7 Payment Entity (`payments`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `orderId` (`String`): Razorpay Order ID (`"order_xxxx"`).
  - `paymentId` (`String`): Captured payment ID (`"pay_xxxx"`).
  - `bookingId` (`String`): Reference to the booking entity.
  - `amount` (`Number`): Amount in paise/rupees.
  - `status` (`String`): Gateway lifecycle state (`'created'`, `'authorized'`, `'captured'`, `'refunded'`, `'failed'`).
  - `signature` (`String`): HMAC-SHA256 hash verified by backend.

### 2.8 Favorite Entity (`favorites`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Compound Index**: `{ userEmail: 1, movieId: 1 }` with `{ unique: true }` ensuring no duplicate watchlist entries.

### 2.9 Review Entity (`reviews`)
- **Primary Identifier**: `_id` (`ObjectId`)
- **Key Fields**:
  - `userEmail` (`String`): Submitter's email.
  - `movieId` (`String`): Target movie identifier.
  - `rating` (`Number`): Integer rating from 1 to 10.
  - `reviewText` (`String`): Written feedback.

---

## 3. Data Integrity & Concurrency Rules

1. **Temporary Seat Locking (TTL)**:
   - When seats are locked, `tickets[seatId].status` is set to `"locked"`, with `lockedBy = userEmail` and `lockExpiresAt = Date.now() + 10 * 60 * 1000`.
   - A minute-interval cron job (`cleanupService.js`) sweeps expired locks back to `"available"`.
2. **Refund Seat Freeing**:
   - When an administrator triggers a refund, the payment status changes to `"Refunded"`, and all seats in `selectedSeats` are instantly reset to `"available"`.
3. **Compound Uniqueness**:
   - Favorites prevent double-bookmarking via MongoDB compound indexes.
   - Show IDs and Booking IDs enforce strict single-occurrence integrity.
