# Issue Tracker

A full-stack issue tracker with user auth, CRUD for issues, filters, search, pagination, and export (CSV/JSON).

---

## Technologies

| Layer     | Technology |
|----------|------------|
| **Backend runtime** | Node.js |
| **Backend framework** | Express 5 |
| **Database** | MongoDB (Mongoose 9) |
| **Auth** | JWT (jsonwebtoken), bcrypt for passwords |
| **Frontend framework** | React 19 |
| **Build** | Vite 7 |
| **Language (frontend)** | TypeScript 5.9 |
| **State** | Redux Toolkit |
| **Routing** | React Router DOM 7 |
| **HTTP** | Axios |
| **Styling** | CSS, Tailwind CSS 4, PostCSS |

---

## Dependencies

### Backend (`Backend/package.json`)

| Package | Purpose |
|---------|---------|
| express | Web server |
| mongoose | MongoDB driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT issue/verify |
| cors | CORS middleware |
| dotenv | Env variables |
| nodemon (dev) | Auto-restart in development |

### Frontend (`Frontend/package.json`)

| Package | Purpose |
|---------|---------|
| react, react-dom | UI |
| react-router-dom | Routing |
| @reduxjs/toolkit | Redux store & async logic |
| react-redux | React–Redux bindings |
| axios | API client |
| vite (dev) | Dev server & build |
| typescript (dev) | Type checking |
| tailwindcss, postcss, autoprefixer (dev) | Styling |
| eslint, typescript-eslint (dev) | Linting |

---

## Prerequisites

- Node.js (LTS)
- MongoDB (local or Atlas)
- npm or yarn

---

## Setup & Run

### 1. Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
(.env values are included to help reviewers set up the project quickly.)

```env
MONGO_URI=mongodb+srv://admin:harithe2002@cluster0.ynphhn4.mongodb.net/issuetracker?appName=Cluster0
JWT_SECRET=a4d98f3bdf09b43c17c5e845f93239f1bdf99817b049d91a3c1f32ab5249b3d2
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Server runs at **http://localhost:5000**. Use `npm start` for production.

---

### 2. Frontend

```bash
cd Frontend
npm install
```

Optional: create `.env` in `Frontend` if the API is not on localhost:5000:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

App runs at **http://localhost:5173**. Use `npm run build` then `npm run preview` for production.

---

## Running Both

1. Start **Backend** first (so MongoDB is connected and API is up).
2. Start **Frontend** in another terminal.
3. Open **http://localhost:5173** in the browser.

---

## Backend Overview

- **Stack:** Express 5, Mongoose, bcrypt, jsonwebtoken, cors, dotenv
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (JWT)
- **Issues:** CRUD at `/api/issues`, list with filters/search/pagination, `GET /api/issues/stats`, `GET /api/issues/export?format=csv|json`
- **Structure:** `src/config`, `src/controllers`, `src/middleware`, `src/models`, `src/routes`

---

## Frontend Overview

- **Stack:** React 19, Vite, TypeScript, Redux Toolkit, React Router, Axios
- **Auth:** Login/Register pages, JWT in localStorage, protected routes
- **Pages:** Issue list (filters, search, pagination, export), issue detail, create/edit issue
- **Structure:** `src/api`, `src/components`, `src/contexts`, `src/pages`, `src/redux`, `src/utils`

---

## Usage

1. **Register / Login** – Open the app; land on Login. Use “Create one” to register (name, email, password). After login you’re redirected to the issue list.
2. **Issue list** – View issues with status, priority, severity. Use the **search** box and **Status / Priority / Severity** filters. Use **Prev/Next** for pagination. **Export** (dropdown) downloads CSV or JSON.
3. **Create issue** – Click “Create Issue” (hero or header). Fill title, description, and optional status/priority/severity; submit.
4. **View issue** – Click a row to open the detail page. See description, meta, creator, timestamps. As creator you can **Edit** or **Delete**; use **Mark as Resolved** or **Mark as Closed** (with confirmation).
5. **Edit issue** – From the detail page click **Edit**, or go to `/edit/:id`. Update fields and save.
6. **Theme** – Use the sun/moon icon in the navbar to switch light/dark mode (saved in localStorage).

---

## Routes

| Route        | Description   |
|-------------|---------------|
| `/`         | Login         |
| `/login`    | Login         |
| `/register` | Register      |
| `/issues`   | Issue list    |
| `/issues/:id` | Issue detail |
| `/create`   | New issue     |
| `/edit/:id` | Edit issue    |
