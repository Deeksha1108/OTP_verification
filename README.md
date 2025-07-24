# OTP Verification using NestJS + Redis

This project simulates a real-world OTP (One-Time Password) verification flow — like how apps send a verification code on email for signup or login. Instead of using in-memory logic or third-party services, this system uses **Redis** to store OTPs temporarily, ensuring **security**, **expiry**, and **rate-limiting**.

Built using **NestJS**, **Redis**, and **Nodemailer**, this microservice handles OTP generation, delivery, and secure verification — all in a modular and scalable way.

---

## Key Features

- OTPs are generated and sent to user’s email
- OTPs are stored in Redis temporarily and **hashed using bcrypt**
- Redis ensures **auto-expiry** of OTP after a configurable time (default: 5 mins)
- Rate-limiting: blocks repeated OTP requests within short time (default: 60s)
- OTPs are deleted from Redis after verification (single-use)
- Secure and scalable — no sensitive data stored in plain text
- Clean modular structure (Redis, Email, OTP logic separated)
- Uses **ioredis** (no in-memory logic)
- .env-based config system
- Ready for production and deployment

---

## Real-World Use Case

When a user signs up or logs in:

1. A 6-digit OTP is sent to their email.
2. OTP expires in 5 minutes.
3. User verifies it — success if correct and within time.
4. OTPs are single-use only.
5. Redis TTL + bcrypt + cleanup = secure flow.
6. Rate-limiting prevents OTP spam.

---

## Tech Stack

- **NestJS** (Node.js backend framework)
- **Redis** (via `ioredis`)
- **Nodemailer** (for sending email)
- **bcryptjs** (OTP hashing)
- **dotenv** (.env config handling)

---

## Folder Structure

```bash
OTP/
├── src/
│   ├── app.module.ts               # Root module
│   ├── main.ts                     # Entry point
│
│   ├── common/
│   │   └── utils/
│   │       └── otp-generator.util.ts  # OTP generation logic
│
│   ├── email/
│   │   ├── email.module.ts         # Email module
│   │   └── email.service.ts        # Email sending logic
│
│   ├── otp/
│   │   ├── dto/
│   │   │   ├── send-otp.dto.ts     # Request DTO
│   │   │   └── verify-otp.dto.ts   # Verification DTO
│   │   ├── otp.controller.ts       # OTP routes
│   │   ├── otp.module.ts           # OTP module
│   │   └── otp.service.ts          # Business logic
│
│   ├── redis/
│   │   ├── redis.constants.ts      # Redis constants
│   │   ├── redis.module.ts         # Redis module provider
│   │   └── redis.service.ts        # Redis interaction service
│
├── .env                             # Environment variables
```

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/otp-verification.git
cd otp-verification
npm install
```

### 2. Create `.env`

```env
# Redis Config
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Config (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=MyApp <your_email@gmail.com>

# OTP Config
OTP_EXPIRE_SECONDS=300       # OTP expires after 5 mins
RATE_LIMIT_TTL=60            # Block repeat requests for 60s
```

### 4. Start the Server

```
npm run start:dev
```

### 5. Open Swagger API Docs

```
After starting the server, open your browser and navigate to:

http://localhost:3000/api

```

---

## Test the Flow

### Step 1: Send OTP

```
POST http://localhost:3000/otp/send

Request Body:
{
  "email": "user@example.com"
}

Response:
{
  "message": "OTP sent successfully to user@example.com"
}

```

### Step 2: Verify OTP

```

POST http://localhost:3000/otp/verify

Request Body:
{
"email": "user@example.com",
"otp": "123456"
}

Response:
{
"message": "OTP verified successfully"
}
OR
{
"message": "Invalid or expired OTP"
}
```

---

## Internal Working

1. OtpService generates a random 6-digit OTP.
2. OTP is hashed using bcrypt.
3. Stored in Redis as:
   - otp:{email} → hashed_otp with TTL.
4. Sent to user via email.
5. On verification:
   - Redis checks for key.
   - Compares hashed value.
   - Deletes OTP on success.

---

## Security Highlights

- OTPs hashed with bcrypt — not reversible.
- Stored only temporarily via Redis TTL.
- Not reusable — auto-deleted after use.
- Rate-limiting blocks spamming.
- No OTP stored in plain text.

---

## What I Learned from This Project

- Secure OTP Flow using Redis TTL: I learned how to securely manage One-Time Passwords using Redis. By leveraging Redis’s built-in TTL (Time To Live) feature, each OTP automatically expires after a predefined time (like 5 minutes). This prevents unauthorized reuse and ensures that expired codes are never valid — enhancing security without manual cleanup.

- Bcrypt Hashing for Sensitive Codes: I implemented bcryptjs to hash OTPs before storing them in Redis. This means even if Redis is somehow compromised, the attacker cannot retrieve the actual OTPs because they are hashed. It's a security best practice to avoid storing sensitive data in plain text.

- Nodemailer Email Transport Best Practices: I used Nodemailer to send OTPs via email using a Gmail SMTP setup. I learned how to configure secure email transport, manage sender information (from headers), and avoid getting flagged as spam by following proper formatting and using Gmail App Passwords instead of actual credentials.

- Redis-Based Rate-Limiting: To prevent spamming and abuse, I added Redis-based rate-limiting. It restricts how often a user can request a new OTP (e.g., once every 60 seconds). Redis stores a timestamp or key for each request, and the server checks before generating a new OTP — ensuring controlled access and protecting email infrastructure.

- NestJS Modular Structure: While building the app, I followed NestJS's modular architecture. Each responsibility — email handling, Redis connection, OTP logic — is separated into its own module. This enhances code readability, scalability, and maintainability. It taught me how to structure a production-level backend using the Separation of Concerns (SoC) principle.

- Creating Injectable Redis Modules in NestJS: One of the most technical things I learned was how to set up a custom, injectable Redis module in NestJS using ioredis. I created a dedicated RedisModule that exports a reusable RedisService, which can be injected into any other service (like OtpService) via NestJS's built-in dependency injection system.

---

## Made By Deeksha

> A lightweight, secure, and modular OTP verification service for email-based flows. Ready to plug into any microservice or monolithic system. Focused on production-readiness, modular code, and best practices.
