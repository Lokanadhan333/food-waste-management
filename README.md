# 🌿 FoodShare – Food Waste Management Website

### *Share Food, Reduce Waste, Feed Lives.*

FoodShare is a full-stack platform that reduces food waste by connecting people and
organisations who have **surplus food** with the people and organisations who **need it**.
Donors list extra food in seconds; shelters, NGOs, and individuals find it and request a
pickup before it expires.

> **Tech stack:** React.js (Vite) + React Router + Fetch API · Node.js + Express.js · MongoDB (Mongoose) · HTML5 · CSS3

---

## 📸 Screenshots

| Home | Find Food |
| --- | --- |
| ![Home page](docs/screenshots/home.png) | ![Find Food page](docs/screenshots/find-food.png) |

| Donate Food | Contact |
| --- | --- |
| ![Donate Food page](docs/screenshots/donate.png) | ![Contact page](docs/screenshots/contact.png) |

![About page](docs/screenshots/about.png)

---

## 🚀 Run This Project Locally (2 minutes)

You need **Node.js v18 or newer** installed ([download here](https://nodejs.org)).

### 🪟 Windows: the easy way (no commands needed)

1. Double-click **`START-FoodShare.bat`** in the project folder.
2. Wait about 30 seconds (the first run installs dependencies).
3. Your browser opens **http://localhost:5173** automatically. 🎉

To shut it down later, double-click **`STOP-FoodShare.bat`**.

> Two small windows will appear (the backend and the website). Leave them open while you use
> the site — closing them stops the app.

### 🧑‍💻 Any system: manual setup

**1. Get the code**

```bash
git clone https://github.com/Lokanadhan333/food-waste-management.git
cd food-waste-management
```

### 2. Start the backend (leave this terminal running)

```bash
cd server
npm install
npm run dev
```

You should see:

```
[database] MONGODB_URI is not set - running with the IN-MEMORY store (data is temporary).
FoodShare API running on http://localhost:5000
```

### 3. Start the frontend (open a **second** terminal)

```bash
cd client
npm install
npm run dev
```

### 4. Open your browser

👉 **http://localhost:5173**

That's it — the whole donation workflow works out of the box, no database setup required. 🎉

> **No MongoDB yet?** No problem. With `MONGODB_URI` empty, the server automatically uses a
> temporary in-memory store so you can try everything immediately. Data resets when the server
> restarts. See [Database Configuration](#-database-configuration) to switch to MongoDB.

---

## ✅ Try the Complete Workflow

1. **Donate Food** — fill in the form (e.g. 40 boxes of biryani, deadline a few hours ahead) and
   click **Submit Donation**. You'll get a success message and a private **delete token**.
2. **Find Food** — your donation appears as a card. Try the **search bar** and **category filter**.
3. **Request Food** — click it, enter your name and number, and send. The donor's pickup contact
   is revealed only to you.
4. **Delete** — back on Find Food, the donor (whose browser holds the delete token) can remove
   the listing. Anyone else gets a `403`.

---

## ✨ Features

| Page | What it does |
| --- | --- |
| **Home** | Hero section, "Donate Food" & "Find Food" buttons, live statistics (donations, requests, people helped, meals available) |
| **Donate Food** | Full donation form with client + server validation, loading/success/error states, one-time private delete token |
| **Find Food** | Search bar, category filter, donation cards, "Request Food" flow, empty state, authorized delete |
| **About** | Why food waste matters and how FoodShare helps communities |
| **Contact** | Contact form (name, email, message) saved through the API |

### Design
Clean, modern, eco-friendly look in **green, white, and light-orange**; responsive on mobile,
tablet, and desktop; hover animations; accessible forms with labels and focus outlines.

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
    "preparedAt": "2026-10-20T15:45",
    "expiresAt": "2026-10-20T21:45",
    "pickupLocation": "12 MG Road, Bengaluru",
    "contactNumber": "+91 98765 43210"
  }'
```

The response contains a one-time **`deleteToken`** — keep it private, it's the only way to delete
the donation later:

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

Use [Postman](https://www.postman.com/) or the [Thunder Client](https://www.thunderclient.com/)
VS Code extension — pick the method, paste the URL, choose a **JSON** body, and send.

---

## 📁 Project Structure

```
food-waste-management/
├── README.md
├── render.yaml              # Optional one-click backend deploy (Render Blueprint)
├── docs/screenshots/        # README images
├── client/                  # React frontend (Vite)
│   ├── index.html
│   ├── .env.example         # VITE_API_URL=http://localhost:5000
│   ├── vite.config.js
│   ├── vercel.json          # SPA rewrites for Vercel
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/index.css
│       ├── services/api.js  # Reusable Fetch API service
│       ├── components/      # Navbar, Footer, DonationCard, Spinner, Message
│       └── pages/           # Home, Donate, FindFood, About, Contact
└── server/                  # Express backend
    ├── .env.example         # PORT, CLIENT_URL, MONGODB_URI
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

## ⚙️ Environment Variables

**Backend** — copy `server/.env.example` to `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
```

**Frontend** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> 🔒 Only `VITE_API_URL` is exposed to the browser. **Database credentials never leave the
> backend.**

---

## 🗄️ Database Configuration

**Option A — MongoDB (persistent data)**

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your IP address.
3. Put the connection string in `server/.env`:

   ```env
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/foodshare
   ```

4. Restart the server — you'll see `[database] Connected to MongoDB.`

**Option B — In-memory store (no setup)**

Leave `MONGODB_URI` empty. The server warns you and uses a temporary in-memory store.
`GET /api/health` reports `"database": "in-memory"`. Data is lost on restart — ideal for a
quick local demo.

**Stored data:** food donation details, donor information, pickup locations, expiry deadlines,
collection requests, and donation status (`available`, `requested`, `collected`, `expired`).

---

## 🔒 Security & Validation

- **Dual validation** — every field is validated in React *and* again in Express.
- **Food safety** — deadlines in the past are rejected; expired donations are auto-marked
  `expired` and can't be requested.
- **Authorized deletion** — a random `deleteToken` per donation, returned once to the donor and
  checked via the `X-Delete-Token` header. Anyone else gets `403`.
- **Privacy** — donor phone numbers are hidden from public listings and shared only with people
  who submit a request.
- **Rate limiting** — 300 requests / 15 min per IP; 30 / 15 min on forms.
- **helmet** HTTP headers, CORS restricted to `CLIENT_URL`, and a central error handler that
  never leaks stack traces.

---

## 🧩 Available Scripts

| Location | Command | What it does |
| --- | --- | --- |
| `server/` | `npm run dev` | Start Express with auto-reload |
| `server/` | `npm start` | Start Express |
| `client/` | `npm run dev` | Start Vite dev server (port 5173) |
| `client/` | `npm run build` | Production build to `client/dist/` |
| `client/` | `npm run preview` | Preview the production build |

---

## 🌐 Deployment

**Backend (Render)**

1. Push this repo to GitHub.
2. In Render: **New + → Blueprint** → select this repo (it reads `render.yaml`) → **Apply**.
3. Set `CLIENT_URL` to your deployed frontend URL and add `MONGODB_URI` for persistent data.

**Frontend (Vercel / Netlify)**

1. Import the repo; set **Root Directory** to `client`.
2. Add the environment variable `VITE_API_URL` = your deployed backend URL.
3. Deploy. Client-side routing works via the included `client/vercel.json` (for Netlify, add a
   `_redirects` file containing `/* /index.html 200`).

---

Made with 💚 to share food, reduce waste, and feed lives.
