# 📝 Note - Nova 

A fast, modern, full-stack note-taking web application built with **React + Django REST Framework**.  
Features JWT authentication, real-time search, offline-aware caching, and a premium responsive UI that works beautifully on every device.

🌐 **Live Demo:** https://ahnotes.netlify.app

---

# ✨ Features

## 🔐 Authentication
- Register, login, and logout using JWT authentication
- Access + Refresh token system
- Automatic silent token refresh
- Forgot password flow:
  - Enter username
  - Receive email OTP
  - Verify 4-digit code
  - Reset password
- Protected routes for authenticated users
- Redirect authenticated users away from auth pages

---

## 📋 Notes Management
- Create notes
- Read notes
- Update notes
- Delete notes
- Instant local cache loading using localStorage
- Optimistic delete UI
- Pin important notes
- Long-press support for pinning
- Pinned notes stay on top
- 9 pastel color themes for notes
- Real-time search
- Sort notes:
  - Newest
  - Oldest
  - A → Z
  - Z → A
- Word & character counter
- Unsaved changes warning
- Auto discard empty notes

---

## 🎨 Premium UI / UX
- Modern responsive design
- Light & Dark themes
- Skeleton loading animations
- Smooth card animations
- Empty state illustrations
- Relative timestamps:
  - “Edited 2 hours ago”
- Mobile bottom navigation
- Responsive toast notifications
- Grid & List view toggle
- 3-line note preview clamp
- Persistent settings using localStorage

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Styling | CSS Variables, Inter Font |
| State Management | React Hooks |
| HTTP Client | Axios |
| Backend | Django 5 |
| API | Django REST Framework |
| Authentication | Simple JWT |
| Database | PostgreSQL |
| Email Service | Gmail SMTP |
| Deployment | Netlify + Railway |

---

# 📁 Project Structure

```bash
src/
├── services/
│   ├── api.js
│   ├── authService.js
│   └── noteService.js
│
├── hooks/
│   ├── useAuth.js
│   └── useNotes.js
│
├── utils/
│   ├── storage.js
│   ├── validators.js
│   └── formatDate.js
│
├── component/
│   ├── ProtectedRoute.jsx
│   ├── AuthRoute.jsx
│   ├── login.jsx
│   ├── register.jsx
│   ├── forgotPassword.jsx
│   ├── verify.jsx
│   └── reset.jsx
│
├── page/
│   ├── header.jsx
│   ├── NewNote.jsx
│   ├── setting.jsx
│   ├── loading.jsx
│   └── error.jsx
│
├── theme/
│   └── ThemeContext.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 🚀 Getting Started

## 📌 Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL

---

# ⚛️ Frontend Setup

```bash
# Clone repository
git clone https://github.com/your-username/ah-notes.git

# Go to project
cd ah-notes

# Install dependencies
npm install
```

Create `.env` file:

```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

Run development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

---

# 🐍 Backend Setup (Django)

```bash
# Clone backend repo
git clone https://github.com/your-username/ah-notes-api.git

# Go to backend
cd ah-notes-api

# Create virtual environment
python -m venv venv
```

Activate virtual environment:

### Windows
```bash
venv\Scripts\activate
```

### Linux / Mac
```bash
source venv/bin/activate
```

Install requirements:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```env
SECRET_KEY=your-secret-key

DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_PORT=5432

EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

Run migrations:

```bash
python manage.py migrate
```

Start server:

```bash
python manage.py runserver
```

---

# 🔑 Django JWT Configuration

Add this inside `settings.py`:

```python
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),

    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}
```

---

# 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register/` | Register user | ❌ |
| POST | `/login/` | Login user | ❌ |
| POST | `/token/refresh/` | Refresh JWT token | ❌ |
| POST | `/forgot-password/` | Send OTP email | ❌ |
| POST | `/verify/` | Verify OTP | ❌ |
| POST | `/reset/` | Reset password | ❌ |
| GET | `/notes/` | Get all notes | ✅ |
| POST | `/notes/` | Create note | ✅ |
| GET | `/notes/:id/` | Get single note | ✅ |
| PUT | `/notes/:id/` | Update note | ✅ |
| DELETE | `/notes/:id/` | Delete note | ✅ |
| DELETE | `/users/:id/` | Delete account | ✅ |

---

# 🧠 Key Architecture Decisions

## 🔄 Axios Interceptor
A single Axios instance automatically:
- Attaches JWT tokens
- Refreshes expired access tokens
- Retries failed requests
- Queues requests during refresh

---

## ⚡ Cache-First Loading
Notes load instantly from localStorage first, then sync with the server in the background.

---

## 🚀 Optimistic UI
Deleting a note updates the UI immediately before waiting for the server response.

---

## 🧩 Clean Separation of Concerns

### Services
Handle API communication only.

### Hooks
Handle application state and side effects.

### Components
Responsible only for rendering UI.

### Utilities
Contain pure reusable helper functions.

---

## 📦 Route-Level Code Splitting
Pages are lazy-loaded using `React.lazy()` to reduce initial bundle size and improve performance.

---

# 🎨 Design System

CSS custom properties are used for consistent theming.

```css
--bg
--surface
--border
--txt
--txt-secondary
--txt-muted
--accent
--accent-soft
--shadow-sm
--shadow-md
--shadow-lg
--radius-sm
--radius-md
--radius-lg
```

---

# 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| > 900px | Multi-column desktop layout |
| 600–900px | Tablet layout |
| 450–600px | Compact grid layout |
| ≤ 450px | Mobile layout with bottom nav |

---

# 🔒 Security Notes

Never push secrets to GitHub.

Add these to `.gitignore`:

```gitignore
.env
.env.local
*.env
```

Sensitive environment variables:

```env
SECRET_KEY
DB_PASSWORD
EMAIL_HOST_PASSWORD
```

---

# 📦 Dependencies

## Frontend

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "axios": "latest",
  "react-toastify": "latest"
}
```

---

## Backend

```txt
django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
whitenoise
psycopg2-binary
```

---

# 📸 Screenshots

> Add your screenshots here

```md
![Home](./screenshots/home.png)
![Editor](./screenshots/editor.png)
![Dark Theme](./screenshots/dark.png)
```

---

# 🌟 Future Improvements

- Rich text editor
- Markdown support
- AI-powered note summaries
- Drag & drop note organization
- Note sharing
- Real-time collaboration
- PWA offline support
- Voice notes
- File attachments

---

# 🙋 Author

## Ali Hassan

Built with ❤️ using React & Django

---

# 📄 License

MIT License

Free to use, modify, and distribute.
