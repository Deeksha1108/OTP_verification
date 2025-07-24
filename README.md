# OTP Verification Service using NestJS + Redis

This project simulates a real-world OTP (One-Time Password) verification flow — like how apps send a verification code on email for signup or login. Instead of using in-memory logic or third-party services, this system uses **Redis** to store OTPs temporarily, ensuring **security**, **expiry**, and **rate-limiting**.

Built using **NestJS**, **Redis**, and **Nodemailer**, this microservice handles OTP generation, delivery, and secure verification — all in a modular and scalable way.

---

## Key Features

- OTPs are generated and sent to user’s email
- OTPs are stored in Redis temporarily and **hashed using bcrypt**
- Redis ensures **auto-expiry** of OTP after a configurable time (default: 5 mins)
- Rate-limiting: blocks repeated OTP requests within short time (60s default)
- OTPs are deleted from Redis after verification (used only once)
- Secure and scalable — no sensitive data stored in plain text
- Clean modular structure (separate Redis, Email, OTP logic)
- Uses **ioredis** instead of in-memory store
- Built-in support for **.env** config, email transport config, etc.
- **Fully production-ready**, usable as a standalone microservice

---

## Real-World Use Case

Whenever a user signs up or logs in:

- The system sends a 6-digit OTP to their email
- OTP expires in 5 minutes
- If user enters the correct OTP in time, verification is successful
- If they delay or reuse old OTP, verification fails
- Redis ensures expiry + single-use enforcement
- Rate-limit ensures a user can't spam OTP requests

---

## Tech Stack

- **NestJS** (backend framework)
- **Redis** via **ioredis**
- **Nodemailer** (SMTP email sending)
- **bcryptjs** for secure OTP hashing
- **dotenv** for environment config

---

## Folder Structure

```bash
OTP/
├── src/
│   ├── app.module.ts               # Root module
│   ├── main.ts                     # App entry point
│
│   ├── common/
│   │   └── utils/
│   │       └── otp-generator.util.ts  # OTP generation utility
│
│   ├── email/
│   │   ├── email.module.ts         # Email module setup
│   │   └── email.service.ts        # Handles sending emails
│
│   ├── otp/
│   │   ├── dto/
│   │   │   ├── send-otp.dto.ts     # DTO for sending OTP
│   │   │   └── verify-otp.dto.ts   # DTO for verifying OTP
│   │   ├── otp.controller.ts       # Routes for OTP
│   │   ├── otp.module.ts           # OTP module
│   │   └── otp.service.ts          # OTP business logic
│
│   ├── redis/
│   │   ├── redis.constants.ts      # Redis key prefixes/constants
│   │   ├── redis.module.ts         # ioredis provider module
│   │   └── redis.service.ts        # Redis client wrapper
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

`````
2. Create .env File
env
Copy code
# Redis Config
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (SMTP) Config
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=MyApp <your_email@gmail.com>

# OTP Config
OTP_EXPIRE_SECONDS=300       # OTP valid for 5 minutes
RATE_LIMIT_TTL=60            # Prevent OTP resend within 60s
```
---

3. Start Server
````bash
Copy code
npm run start:dev
Visit: http://localhost:3000
`````

---

## API Endpoints

1. Send OTP

---

POST /otp/send
Content-Type: application/json

---

Request Body:
{
"email": "user@example.com"
}

---

Response:
{
"message": "OTP sent successfully to user@example.com"
}

---

2. Verify OTP
   POST /otp/verify

---

Request Body:

{
"email": "user@example.com",
"otp": "123456"
}

---

Response (Success):
{
"message": "OTP verified successfully"
}

---

Response (Failure):
{
"message": "Invalid or expired OTP"
}

---

## Internal Working

1. OtpService generates a random 6-digit OTP
2. OTP is hashed using bcrypt before storing
3. Redis stores:
   otp:{email} → hashed_otp (with TTL)
4. Email is sent via Nodemailer
5. On verify:
   Redis is checked for key
   Entered OTP is compared with hashed one
   If matched, OTP is deleted & success returned

---

## Security Highlights

- OTPs never stored in plaintext
- OTP expires automatically after TTL
- bcrypt used to hash OTPs (cannot reverse)
- Rate limit prevents email spamming
- Redis cleanup after OTP usage

---

## Improvements for future

- SMS OTP (via Twilio)
- Add Swagger (@nestjs/swagger) for API docs
- Add unit tests using Jest
- Add frontend UI for manual testing
- Add resend email button with cooldown logic
- Support multi-language messages

---

## What I Learned from This Project

- How to securely generate and manage OTPs using Redis
- Importance of TTL and hashed storage for sensitive values
- How to send production-ready emails with Nodemailer
- How to implement rate-limiting logic at Redis level
- Built-in NestJS DI, module, and service separation
- Wrapping ioredis in a module for easy injection

---

## Made By Deeksha

A lightweight, secure, and modular OTP verification service for email-based flows. Ready to plug into any microservice or monolithic system. Focused on production-readiness, modular code, and good practices.

```

```
