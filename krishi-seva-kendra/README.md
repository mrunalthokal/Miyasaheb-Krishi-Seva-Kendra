# Krishi Seva Kendra — Farmer Support & Agri-Input Portal

A minor project implementing the SRS: a farmer-facing portal to browse agri-inputs,
request products, track requests, view government schemes, seasonal crop tips and
local weather — plus an admin panel to manage all of it.

**Stack:** Node.js + Express + MongoDB (Mongoose) on the backend, vanilla HTML/CSS/JS
on the frontend (no framework, no build step), JWT auth, bcrypt password hashing.

## Folder structure

```
krishi-seva-kendra/
├── server/          Express API + MongoDB models
│   ├── config/       Database connection
│   ├── models/        Mongoose schemas
│   ├── middleware/    Auth guard, error handler
│   ├── controllers/   Route logic
│   ├── routes/        Express routers
│   ├── services/      Weather API integration
│   ├── seed/          Sample data seeder
│   └── server.js       Entry point
└── client/          Static frontend (served by the same server)
    ├── css/style.css
    ├── js/            One file per page + shared helpers (api.js, auth.js, nav.js)
    └── *.html          One page per screen
```

## 1. Prerequisites

- Node.js 18+ and npm
- MongoDB running locally on `mongodb://localhost:27017` (install MongoDB Community
  Server, or run `mongod` if you already have it installed)
- A free OpenWeatherMap API key from https://openweathermap.org/api (needed for the
  live weather feature — sign up, go to "My API keys", copy the default key)

## 2. Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in:

```
MONGO_URI=mongodb://localhost:27017/krishi_seva_kendra
JWT_SECRET=<any long random string>
OPENWEATHER_API_KEY=<your key from openweathermap.org>
DEFAULT_DISTRICT=Ahilyanagar        # change to your district
```

> Note: OpenWeatherMap keys can take a few minutes to activate after signup — if
> `/weather` returns a 401 right after creating the key, wait a bit and retry.

## 3. Seed sample data (recommended for a demo)

```bash
npm run seed
```

This creates:
- One admin account — mobile from `.env` (`9999999999` by default), password `Admin@123`
- 4 product categories, 10 sample products
- 3 government schemes, 4 crop tips

Re-running `npm run seed` is safe — it skips anything that already exists.

## 4. Run the app

```bash
npm run dev      # with nodemon (auto-restart), or:
npm start
```

Then open **http://localhost:5000** — the same server serves both the API
(`/api/...`) and the frontend pages, so there's nothing else to start.

- Farmer side: register at `/register.html`, then browse `/products.html`
- Admin side: log in at `/admin-login.html` with the seeded admin credentials

## 5. Key features implemented (mapped to the SRS)

| Feature | Where |
|---|---|
| Farmer registration & login (JWT) | `auth.js` controller, `register.html` / `login.html` |
| Farmer profile view/update | `profile.html` |
| Product catalog with search, category & availability filters | `products.html` |
| Product details + place a request | `product-details.html` |
| Track my requests | `my-inquiries.html` |
| Government schemes listing | `schemes.html` |
| Seasonal crop tips (filter by season) | `crop-tips.html` |
| Live weather by district (OpenWeatherMap) | `weather.html`, homepage hero |
| Contact / query form | `contact.html` |
| Admin: manage products (CRUD) | `admin-products.html` |
| Admin: manage requests (approve/reject/fulfill) | `admin-inquiries.html` |
| Admin: manage farmer accounts (activate/deactivate) | `admin-farmers.html` |
| Admin: manage schemes & crop tips, view contact messages | `admin-content.html` |
| Admin: dashboard summary counts | `admin-dashboard.html` |

## 6. Security notes

- Passwords are hashed with bcrypt before storage — never stored in plain text.
- JWTs carry the user id and role (`Farmer` / `Admin`); every protected route checks
  the role server-side, not just in the UI.
- The OpenWeatherMap API key stays on the server (`services/weatherService.js`) and
  is never exposed to the browser.

## 7. Customizing the look

All design tokens (colors, fonts, spacing) live at the top of `client/css/style.css`
under `:root`. The palette is a green/brown/wheat theme distinct from generic
Bootstrap defaults, using Fraunces for headings and Inter for body text.
