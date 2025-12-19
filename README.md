# 🔐 OAuth2.0 Social Login Application

A full-stack application demonstrating OAuth2.0 authentication with Google and GitHub using React.js and Node.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [OAuth Setup](#-oauth-setup)
- [Running the Application](#-running-the-application)
- [How It Works](#-how-it-works)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

- 🔑 **Google OAuth2.0** - Sign in with Google account
- 🐙 **GitHub OAuth2.0** - Sign in with GitHub account
- 🔒 **Session-based Authentication** - Secure session management
- 🎨 **Modern UI** - Beautiful, responsive interface
- 🚀 **RESTful API** - Clean backend architecture
- 🍪 **HTTP-only Cookies** - XSS protection
- ✅ **CORS Configured** - Secure cross-origin requests
- 📱 **Mobile Responsive** - Works on all devices

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Passport.js** - Authentication middleware
- **express-session** - Session management
- **passport-google-oauth20** - Google OAuth strategy
- **passport-github2** - GitHub OAuth strategy
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      OAuth2.0 PROVIDERS                          │
│                                                                  │
│    ┌──────────────┐                    ┌──────────────┐        │
│    │   Google     │                    │   GitHub     │        │
│    │   OAuth      │                    │   OAuth      │        │
│    └──────┬───────┘                    └──────┬───────┘        │
│           │                                    │                 │
└───────────┼────────────────────────────────────┼─────────────────┘
            │                                    │
            │          OAuth2.0 Flow             │
            │                                    │
┌───────────┼────────────────────────────────────┼─────────────────┐
│           │         BACKEND (Port 5000)        │                 │
│           │                                    │                 │
│    ┌──────▼────────────────────────────────────▼──────┐         │
│    │         Express.js + Passport.js                 │         │
│    │                                                   │         │
│    │  ┌─────────────┐        ┌──────────────┐        │         │
│    │  │  Passport   │        │   Session    │        │         │
│    │  │ Strategies  │◄──────►│   Storage    │        │         │
│    │  └─────────────┘        └──────────────┘        │         │
│    │                                                   │         │
│    │  Routes:                                         │         │
│    │  • GET  /auth/google                             │         │
│    │  • GET  /auth/google/callback                    │         │
│    │  • GET  /auth/github                             │         │
│    │  • GET  /auth/github/callback                    │         │
│    │  • GET  /auth/user                               │         │
│    │  • GET  /auth/logout                             │         │
│    └───────────────────────────────────────────────────┘         │
│                                                                  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    HTTP + Cookies
                             │
┌────────────────────────────┴─────────────────────────────────────┐
│                    FRONTEND (Port 3000)                           │
│                                                                   │
│    ┌──────────────────────────────────────────────────┐         │
│    │              React Application                    │         │
│    │                                                   │         │
│    │  Components:                                     │         │
│    │  ┌─────────────┐  ┌──────────────┐              │         │
│    │  │   Login     │  │  Dashboard   │              │         │
│    │  │   Page      ├─►│    Page      │              │         │
│    │  └─────────────┘  └──────────────┘              │         │
│    │                                                   │         │
│    │  Routes:                                         │         │
│    │  • /              → Login Page                   │         │
│    │  • /auth/success  → Success Handler              │         │
│    │  • /dashboard     → User Dashboard               │         │
│    └───────────────────────────────────────────────────┘         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### OAuth2.0 Authentication Flow

```
┌─────────┐                                              ┌──────────┐
│  User   │                                              │  OAuth   │
│ Browser │                                              │ Provider │
└────┬────┘                                              └────┬─────┘
     │                                                        │
     │ 1. Click "Login with Google/GitHub"                   │
     ├──────────────────►                                    │
     │                  │                                    │
     │                  │ 2. GET /auth/google                │
     │                  ▼                                    │
     │          ┌────────────────┐                           │
     │          │    Backend     │                           │
     │          │   (Node.js)    │                           │
     │          │                │ 3. Redirect with          │
     │          │  Passport.js   ├──────────────────────────►│
     │          │   initiates    │   client_id & scopes      │
     │          │   OAuth flow   │                           │
     │          └────────────────┘                           │
     │                  ▲                                    │
     │                  │                                    │
     │ 4. Google/GitHub login page                           │
     │◄──────────────────────────────────────────────────────┤
     │                                                        │
     │ 5. User enters credentials & approves                 │
     ├───────────────────────────────────────────────────────►│
     │                                                        │
     │                  │  6. Authorization code             │
     │                  │◄───────────────────────────────────┤
     │                  │     (callback URL)                 │
     │          ┌────────────────┐                           │
     │          │    Backend     │                           │
     │          │   /callback    │ 7. Exchange code for      │
     │          │                ├──────────────────────────►│
     │          │  - Receives    │    access token           │
     │          │    auth code   │                           │
     │          │  - Exchanges   │ 8. Access token +         │
     │          │    for token   │◄──────────────────────────┤
     │          │  - Creates     │    user profile           │
     │          │    session     │                           │
     │          └────────────────┘                           │
     │                  │                                    │
     │ 9. Redirect to frontend with success                  │
     │◄─────────────────┤                                    │
     │    + session cookie                                   │
     │                                                        │
     │ 10. Navigate to /dashboard                            │
     │     with session cookie                               │
     ├──────────────────►                                    │
     │                  │                                    │
     │ 11. User profile data                                 │
     │◄─────────────────┤                                    │
     │                  │                                    │
     ▼                  ▼                                    ▼
```

### Data Flow

```
1. User Clicks Login
   └─► Frontend redirects to: http://localhost:5000/auth/google

2. Backend Initiates OAuth
   └─► Passport redirects to: https://accounts.google.com/o/oauth2/...
       Parameters:
       • client_id
       • redirect_uri
       • response_type=code
       • scope=profile email

3. User Authenticates
   └─► On Google/GitHub website
   └─► User logs in and approves permissions

4. OAuth Provider Returns Code
   └─► Redirects to: http://localhost:5000/auth/google/callback?code=xyz

5. Backend Exchanges Code
   └─► POST to Google/GitHub token endpoint
       {
         code: "xyz",
         client_id: "...",
         client_secret: "...",
         grant_type: "authorization_code"
       }

6. Receives Access Token
   └─► {
         "access_token": "ya29.a0...",
         "token_type": "Bearer",
         "expires_in": 3600
       }

7. Fetches User Profile
   └─► GET https://www.googleapis.com/oauth2/v2/userinfo
       Authorization: Bearer ya29.a0...

8. Creates Session
   └─► req.session.user = { id, name, email, picture }
   └─► Sets cookie: connect.sid=s%3A...

9. Redirects to Frontend
   └─► http://localhost:3000/auth/success

10. Dashboard Loads User Data
    └─► GET http://localhost:5000/auth/user
    └─► Cookie: connect.sid=s%3A...
    └─► Returns: { success: true, user: {...} }
```

---

## 📁 Project Structure

```
backend/
├── backend/                    # Backend server
│   ├── config/
│   │   └── passport.js        # Passport configuration
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   └── .gitignore
│
├── frontend/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js       # Login page component
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.js   # User dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── AuthSuccess.js # OAuth callback handler
│   │   ├── App.js             # Main app component
│   │   ├── App.css
│   │   ├── index.js           # React entry point
│   │   └── index.css
│   ├── package.json           # Frontend dependencies
│   ├── .env                   # Frontend config (not in git)
│   ├── .env.example           # Environment template
│   └── .gitignore
│
├── README.md                   # This file
└── ARCHITECTURE.md            # Detailed architecture docs
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Google Cloud Account** - For Google OAuth
- **GitHub Account** - For GitHub OAuth

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔑 OAuth Setup

### Google OAuth Configuration

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name (e.g., "OAuth Login App")
4. Click **"Create"**

#### Step 2: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and press **"Enable"**

#### Step 3: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Configure the OAuth consent screen (first time):
   - User Type: **External**
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
4. Click **"Save and Continue"**
5. Add scopes (optional): email, profile
6. Click **"Save and Continue"**
7. Add test users if needed
8. Click **"Save and Continue"**

#### Step 4: Create OAuth Client ID

1. Application type: **Web application**
2. Name: "OAuth Web Client"
3. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5000
   ```
4. **Authorized redirect URIs:**
   ```
   http://localhost:5000/auth/google/callback
   ```
5. Click **"Create"**
6. **Copy the Client ID and Client Secret** (you'll need these!)

---

### GitHub OAuth Configuration

#### Step 1: Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**

#### Step 2: Fill in Application Details

- **Application name:** `OAuth Login App` (or any name)
- **Homepage URL:** `http://localhost:3000`
- **Application description:** (optional)
- **Authorization callback URL:** `http://localhost:5000/auth/github/callback`

#### Step 3: Register Application

1. Click **"Register application"**
2. **Copy the Client ID**
3. Click **"Generate a new client secret"**
4. **Copy the Client Secret** immediately (you won't see it again!)

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
PORT=5000
SESSION_SECRET=your-random-secret-key-min-32-characters

# Google OAuth2.0
GOOGLE_CLIENT_ID=618881144636-xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx

# GitHub OAuth2.0
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**🔒 Security Note:** Generate a strong SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
✓ Google OAuth strategy configured
✓ GitHub OAuth strategy configured
Server is running on port 5000
```

If you see warnings instead of checkmarks, verify your `.env` file has the correct credentials.

### Start Frontend Development Server

In a **new terminal**:

```bash
cd frontend
npm start
```

The React app will automatically open at `http://localhost:3000`

---

## 🎯 How It Works

### 1. User Visits Login Page

Navigate to `http://localhost:3000` and see the login page with two buttons:
- **Continue with Google**
- **Continue with GitHub**

### 2. User Clicks Login Button

When clicking "Continue with Google":

```javascript
// Frontend redirects to backend
window.location.href = 'http://localhost:5000/auth/google'
```

### 3. Backend Initiates OAuth

```javascript
// Backend (server.js)
app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);
```

This redirects the user to Google's login page.

### 4. User Authenticates with Google

- User logs in with Google credentials
- User approves requested permissions (profile, email)
- Google redirects back with authorization code

### 5. Backend Exchanges Code for Token

```javascript
// Passport automatically:
// 1. Receives authorization code
// 2. Exchanges code + client_secret for access_token
// 3. Uses access_token to fetch user profile
// 4. Calls your verify function
```

### 6. Session Created & User Redirected

```javascript
app.get('/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // req.user contains user info
    res.redirect('http://localhost:3000/auth/success');
  }
);
```

### 7. Dashboard Displays User Info

```javascript
// Frontend fetches user data
axios.get('http://localhost:5000/auth/user', {
  withCredentials: true  // Sends session cookie
});
```

---

## 📡 API Documentation

### Authentication Endpoints

#### `GET /auth/google`
Initiates Google OAuth flow.

**Response:** Redirects to Google login page

---

#### `GET /auth/google/callback`
Google OAuth callback URL.

**Query Parameters:**
- `code` - Authorization code from Google

**Response:** Redirects to frontend with session cookie

---

#### `GET /auth/github`
Initiates GitHub OAuth flow.

**Response:** Redirects to GitHub login page

---

#### `GET /auth/github/callback`
GitHub OAuth callback URL.

**Query Parameters:**
- `code` - Authorization code from GitHub

**Response:** Redirects to frontend with session cookie

---

#### `GET /auth/user`
Get current authenticated user.

**Headers:**
- `Cookie: connect.sid=...` (automatic)

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://...",
    "provider": "google"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

#### `GET /auth/logout`
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔒 Security Features

### 1. HTTP-Only Cookies
```javascript
cookie: {
  httpOnly: true,  // JavaScript cannot access
  secure: false,   // Set to true with HTTPS in production
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
}
```

### 2. CORS Configuration
```javascript
cors({
  origin: 'http://localhost:3000',  // Only allow frontend
  credentials: true  // Allow cookies
})
```

### 3. Session Secret
- Never commit `.env` to git
- Use strong, random session secrets in production
- Rotate secrets periodically

### 4. OAuth Best Practices
- Client secret never exposed to browser
- Authorization code flow (most secure)
- Limited scopes (only request what you need)
- HTTPS required in production

### 5. Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Set `cookie.secure = true`
- [ ] Use strong session secret
- [ ] Update redirect URIs in OAuth apps
- [ ] Enable CSRF protection
- [ ] Add rate limiting
- [ ] Use Redis for session storage
- [ ] Enable security headers (helmet)
- [ ] Implement logging and monitoring

---

## 🐛 Troubleshooting

### Error: `redirect_uri_mismatch`

**Problem:** Google OAuth redirect URI doesn't match.

**Solution:**
1. Check Google Cloud Console credentials
2. Ensure redirect URI is exactly: `http://localhost:5000/auth/google/callback`
3. No trailing slashes
4. Check for typos

---

### Error: `Cannot GET /auth/success`

**Problem:** Frontend is not running.

**Solution:**
```bash
cd frontend
npm start
```

---

### Error: `EADDRINUSE: address already in use :::5000`

**Problem:** Port 5000 is already in use.

**Solution:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=5001 npm start
```

---

### Warning: OAuth credentials not configured

**Problem:** `.env` file has placeholder values.

**Solution:**
1. Verify `.env` file exists in `backend/` directory
2. Replace placeholder values with real OAuth credentials
3. Restart the server

---

### Error: `Not authenticated` when calling `/auth/user`

**Problem:** Session cookie not being sent.

**Solution:**
1. Ensure `withCredentials: true` in Axios requests
2. Check CORS configuration allows credentials
3. Verify frontend and backend URLs match `.env` files

---

## 📚 Learn More

### Understanding OAuth2.0
- [OAuth 2.0 Simplified](https://aaronparecki.com/oauth-2-simplified/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

### Technologies Used
- [Express.js Documentation](https://expressjs.com/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)
