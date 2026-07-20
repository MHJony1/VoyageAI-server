<div align="center">

# 🛰️ VoyageAI — Server

### The API powering AI-driven travel planning

RESTful API built with Node.js, Express, and TypeScript — handling authentication, destinations, AI trip generation, reviews, and admin operations for the VoyageAI platform.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

[Frontend Repository](https://github.com/MHJony1/VoyageAI-client) · [Report a Bug](../../issues)

</div>

---

## 📖 Overview

This service is the backend for **VoyageAI**, exposing a versioned REST API (`/api/v1`) that the [client application](https://github.com/MHJony1/VoyageAI-client) consumes. It handles everything from user authentication to AI-generated itineraries, built on a clean, modular, layered architecture designed to be easy to extend and reason about.

---

## ✨ Features

| | |
|---|---|
| 🔐 **Authentication** | JWT-based auth with bcrypt password hashing, plus Google OAuth sign-in |
| 🌍 **Destinations** | Full CRUD with search, category/country filtering, sorting, and pagination |
| 🧠 **AI Trip Planning** | Generates structured itineraries via Google Gemini, with retry & graceful degradation on rate limits |
| 💬 **AI Chat** | Conversational endpoint backing the in-app travel assistant |
| 🧳 **Trips** | Create, update, and delete personalized user trips |
| ⭐ **Reviews** | Destination ratings and reviews |
| 🛡️ **Role-Based Access** | User vs. admin permission boundaries enforced at the middleware layer |
| 🧩 **Admin Operations** | Dedicated admin endpoints for managing destinations, users, and content |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt, Google OAuth |
| AI | Google Gemini API |
| Validation | Schema-based request validation middleware |

---

## 📁 Project Structure

```
src/
├── modules/                 # Feature modules — each self-contained
│   ├── auth/                 # route → controller → service → validation
│   ├── user/
│   ├── destination/
│   ├── trip/
│   ├── review/
│   ├── ai/
│   └── admin/
├── middlewares/               # Auth guards, validation, global error handling
├── config/                      # Environment & app configuration
├── utils/                         # Shared helpers
└── app.ts / server.ts               # App bootstrap & entry point
```

Every module follows the same layered convention — **route → middleware → controller → service → model** — so business logic stays decoupled from HTTP concerns and new features are quick to add consistently.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- Google OAuth credentials (for Google Sign-In)

### Installation

```bash
git clone https://github.com/MHJony1/VoyageAI-server.git
cd VoyageAI-server
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/voyageai-db

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

CLIENT_URL=http://localhost:3000
```

> ⚠️ In production, set `CLIENT_URL` to your deployed frontend's domain (required for CORS), and make sure the **Generative Language API** is enabled on the Google Cloud project tied to your Gemini key.

### Run locally

```bash
npm run dev
```

API available at **http://localhost:5000/api/v1**.

### Production build

```bash
npm run build
npm run start
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript → JavaScript |
| `npm run start` | Run the compiled production server |
| `npm run lint` | Run ESLint checks |

---

## 🔌 API Reference

Base URL: `/api/v1`

| Module | Key Endpoints |
|---|---|
| **Auth** | `POST /auth/register` · `POST /auth/login` · `POST /auth/google` · `GET /auth/me` |
| **Destinations** | `GET /destinations` · `GET /destinations/:id` · `POST /destinations` 🔒 admin |
| **Trips** | `GET /trips` · `POST /trips` · `PATCH /trips/:id` · `DELETE /trips/:id` |
| **Reviews** | `GET /reviews/destination/:id` · `POST /reviews` |
| **AI** | `POST /ai/chat` · `POST /ai/trip-plan` · `GET /ai/history` |
| **Dashboard** | `GET /dashboard/overview` · `GET /dashboard/statistics` |
| **Admin** | User, destination & review management under `/admin/*` 🔒 admin |

🔒 = requires authenticated admin role

---

## 🛡️ Security & Reliability

- Passwords hashed with **bcrypt**; stateless session auth via **JWT**
- Centralized error-handling middleware with consistent, typed error responses
- Request validation middleware on every mutating route
- Automatic retry with backoff for transient Gemini API errors, with a clean **503 "service busy"** fallback instead of raw 500s when the AI provider is rate-limited

---

## ☁️ Deployment

Deployable to any Node-compatible host (e.g., **Render**, **Railway**). Configure all environment variables in your provider's dashboard, and double-check `CLIENT_URL` matches your deployed frontend domain so CORS doesn't block requests.

---

## 🗺️ Roadmap

- [ ] API documentation via Swagger/OpenAPI
- [ ] Rate limiting per user/IP
- [ ] Caching layer for frequently accessed destinations
- [ ] Automated test suite (unit + integration)

---


<div align="center">

Built with ❤️ using Node.js, Express & TypeScript

</div>
