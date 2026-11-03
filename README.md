# StudioSpace — Backend API

StudioSpace is a peer-to-peer creative workspace booking platform. This repository contains the backend REST API responsible for studio management, booking operations, database integration, and API security.

**Live Backend API:** https://assignment-8-server-six.vercel.app/

## ✨ Key Features

- **REST API:** Provides endpoints for studio and booking management.
- **Studio Management:** Create, retrieve, update, and delete studio records.
- **Booking Management:** Handle creative workspace booking requests.
- **MongoDB Integration:** Store and manage application data using MongoDB.
- **JWT Security:** Verify JWT tokens to protect selected API endpoints.
- **HTTPOnly Cookies:** Support cookie-based authentication for protected requests.
- **Unauthorized Request Handling:** Reject unauthorized requests with `401 Unauthorized`.

## 🛠️ Technology Stack

- Node.js
- Express.js
- MongoDB
- JWT
- jose

## 🔐 Protected API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/studios` | Create a new studio |
| DELETE | `/api/studios/:id` | Delete a studio by ID |
| POST | `/api/bookings` | Create a new booking |

These endpoints require valid authentication. Unauthorized requests should receive a `401 Unauthorized` response.

## ⚙️ Local Setup

### 1. Clone the Server Repository

```bash
git clone https://github.com/ruhulaminislam/assignment-8-server.git
cd assignment-8-server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server project root.

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
IMGBB_API_KEY=YOUR_IMGBB_API_KEY
CLIENT_URL=http://localhost:3000
```

Replace the placeholders with your own environment variable values.

**Security Note:** Never upload your actual `.env` file, MongoDB credentials, or API keys to GitHub.

### 3. Start the Development Server

```bash
npm run dev
```

The local backend server runs at:

```text
http://localhost:5000
```

## 📌 Project Links

- **Live Backend API:** https://assignment-8-server-six.vercel.app/
- **Server Repository:** https://github.com/ruhulaminislam/assignment-8-server
- **Client Repository:** https://github.com/ruhulaminislam/assignment-8-client
- **Live Website:** https://assignment-8-client.vercel.app/

## 👨‍💻 Developer

Developed as part of the Programming Hero Assignment — StudioSpace.

