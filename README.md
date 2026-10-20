# 🌿 FoodShare – Food Waste Management Website

**Share Food, Reduce Waste, Feed Lives.**

FoodShare is a beginner-friendly, full-stack platform that reduces food waste by connecting
people and organisations who have surplus food with people and organisations who need it.

- **Frontend:** HTML5, CSS3, JavaScript, React.js (Vite), React Router, Fetch API
- **Backend:** Node.js + Express.js REST API
- **Database:** MongoDB with Mongoose (automatic **in-memory fallback** for local development)

---

## ✨ Features

| Page | What it does |
| --- | --- |
| **Home** | Hero section, live statistics (donations, meal requests, people helped), "Donate Food" & "Find Food" buttons |
| **Donate Food** | Full donation form with client + server validation, loading/success/error states, private delete token |
| **Find Food** | Search bar, category filter, donation cards, "Request Food" flow, empty state, authorized delete |
| **About** | Why food waste matters and how FoodShare helps communities |
| **Contact** | Contact form (name, email, message) saved through the API |

### Complete donation workflow

1. A donor submits the **Donate Food** form → `POST /api/donations` → saved in the database.
2. The donation appears on the **Find Food** page → `GET /api/donations`.
3. Someone clicks **Request Food** → `POST /api/donations/:id/request` → the donor's pickup
   contact is shared **only** with the requester.
4. The donor (and only the donor) can delete the listing with a private delete token →
   `DELETE /api/donations/:id`.

---

## 📁 Project Structure

```
food-waste-management/
├── client/                  # React frontend (Vite)
│   ├── index.html
│   ├── .env                 # VITE_API_URL=http://localhost:5000
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/index.css
│       ├── services/api.js  # Reusable Fetch API service
│       ├── components/      # Navbar, Footer, DonationCard, Spinner, Message
│       └── pages/           # Home, Donate, FindFood, About, Contact
└── server/                  # Express backend
    ├── .env                 # PORT, CLIENT_URL, MONGODB_URI
    └── src/
        ├── index.js         # Starts the server
        ├── app.js           # Express app + middleware + routes
        ├── config/          # env.js, db.js (MongoDB connection)
        ├── models/          # Donation, FoodRequest, ContactMessage (Mongoose)
        ├── controllers/     # donationController, contactController
        ├── routes/          # donationRoutes, contactRoutes
        ├── middleware/      # validate, rateLimiter, errorHandler
        └── store/           # In-memory fallback store
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or newer (with npm)
- Optional: a free MongoDB Atlas account for persistent data

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend (in a second terminal)
cd client
npm install
```

### 2. Configure environment variables

**Backend** – copy `server/.env.example` to `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
```

**Frontend** – copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Database configuration

**Option A – MongoDB (recommended for real use)**

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your IP address.
3. Copy the connection string into `MONGODB_URI`, e.g.:

   ```
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/foodshare
   ```

**Option B – In-memory store (local development, no credentials needed)**

Leave `MONGODB_URI` **empty**. The server prints a warning and automatically uses a temporary
in-memory store. The website works exactly the same, but **data is lost when the server
restarts**. This option is clearly marked in the logs and in the API health response
(`"database": "in-memory"`).

### 4. Start both servers

```bash
# Terminal 1 – backend on http://localhost:5000
cd server
npm run dev        # or: npm start

# Terminal 2 – frontend on http://localhost:5173
cd client
npm run dev
```

Open **http://localhost:5173** in your browser. 🎉

---

## 🔌 API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check whether the server is running |
| `GET` | `/api/donations` | List all food donations |
| `GET` | `/api/donations/:id` | Get one donation |
| `POST` | `/api/donations` | Create a donation |
| `POST` | `/api/donations/:id/request` | Submit a food collection request |
| `DELETE` | `/api/donations/:id` | Delete a donation (requires `X-Delete-Token` header) |
| `POST` | `/api/contact` | Send a contact form message |

### Example: create a donation

```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "Green Leaf Restaurant",
    "donorPhone": "+91 98765 43210",
    "foodName": "Vegetable Biryani",
    "description": "Freshly cooked, sealed boxes",
    "quantity": "40",
    "unit": "boxes",
    "category": "vegetarian",
    "preparedAt": "2026-10-20T12:00",
    "expiresAt": "2026-10-20T20:00",
    "pickupLocation": "12 MG Road, Bengaluru",
    "contactNumber": "+91 98765 43210"
  }'
```

The response contains a one-time **`deleteToken`**. Keep it private — it is the only way to
delete the donation later:

```bash
curl -X DELETE http://localhost:5000/api/donations/DONATION_ID \
  -H "X-Delete-Token: THE_DELETE_TOKEN"
```

### Example: request a donation

```bash
curl -X POST http://localhost:5000/api/donations/DONATION_ID/request \
  -H "Content-Type: application/json" \
  -d '{"requesterName": "Hope Shelter", "requesterPhone": "+91 1112223334", "message": "We can collect at 7 PM"}'
```

### Testing with a GUI

Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/)
(VS Code extension) — create a new request, set the method and URL above, choose **JSON** body,
and send.

---

## 🔒 Security & Validation

- **Dual validation** — every field is validated in React *and* again in Express.
- **Food safety** — donations with a deadline in the past are rejected; expired donations are
  automatically marked `expired` and cannot be requested.
- **Database credentials** never appear in frontend code — only `VITE_API_URL` is exposed.
- **Authorized deletion** — a random `deleteToken` is generated per donation, returned once to
  the donor, and checked (via the `X-Delete-Token` header) before deleting. Anyone else gets a
  `403`.
- **Privacy** — donor phone numbers are hidden from public listings and only shared with people
  who submit a request.
- **Rate limiting** — `express-rate-limit` protects the API (300 requests / 15 min, stricter
  30 / 15 min on forms).
- **Headers & errors** — `helmet` sets safe HTTP headers, CORS is restricted to the frontend
  URL, and a central error handler hides stack traces from clients.

---

## 🌐 Deployment

### Backend (Render / Railway / Cyclic)

1. Push the project to GitHub.
2. Create a new **Web Service** pointing at the `server/` folder.
3. Set the environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `CLIENT_URL` = your deployed frontend URL (e.g. `https://foodshare.vercel.app`)
   - `PORT` (usually provided by the platform)
4. Start command: `npm start`

### Frontend (Vercel / Netlify)

1. Set the build directory to `client/` and the build command to `npm run build`.
2. Add the environment variable `VITE_API_URL` = your deployed backend URL.
3. Deploy. For client-side routing (React Router), add a rewrite rule:
   - **Vercel** – `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
   - **Netlify** – `_redirects` file: `/* /index.html 200`

---

## 🧩 Scripts

| Where | Command | What it does |
| --- | --- | --- |
| `server/` | `npm run dev` | Start Express with auto-reload |
| `server/` | `npm start` | Start Express |
| `client/` | `npm run dev` | Start Vite dev server (port 5173) |
| `client/` | `npm run build` | Production build to `client/dist/` |
| `client/` | `npm run preview` | Preview the production build |

---

Made with 💚 to share food, reduce waste, and feed lives.
