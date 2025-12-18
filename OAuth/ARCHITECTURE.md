# OAuth2.0 Social Login - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            OAUTH2.0 PROVIDERS                           │
│                                                                         │
│   ┌──────────────────────┐              ┌─────────────────────────┐   │
│   │   Google OAuth2.0    │              │   GitHub OAuth2.0       │   │
│   │                      │              │                         │   │
│   │  - Client ID         │              │  - Client ID            │   │
│   │  - Client Secret     │              │  - Client Secret        │   │
│   │  - User Profile API  │              │  - User Profile API     │   │
│   └──────────────────────┘              └─────────────────────────┘   │
│             ▲                                      ▲                    │
│             │                                      │                    │
└─────────────┼──────────────────────────────────────┼────────────────────┘
              │                                      │
              │        OAuth2.0 Flow                 │
              │                                      │
┌─────────────┴──────────────────────────────────────┴────────────────────┐
│                         NODE.JS BACKEND                                  │
│                      (Port 5000)                                         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Express.js Server                            │    │
│  │                                                                 │    │
│  │  ┌─────────────────┐    ┌──────────────────┐                  │    │
│  │  │  Passport.js    │    │  Session Store   │                  │    │
│  │  │  Configuration  │◄───┤  (express-session)│                  │    │
│  │  │                 │    │                   │                  │    │
│  │  │  - Google       │    │  - Cookie-based   │                  │    │
│  │  │  - GitHub       │    │  - HttpOnly       │                  │    │
│  │  └─────────────────┘    └──────────────────┘                  │    │
│  │                                                                 │    │
│  │  ┌────────────────────────────────────────────────────────┐   │    │
│  │  │              API Routes                                 │   │    │
│  │  │                                                         │   │    │
│  │  │  GET  /auth/google              - Start Google OAuth   │   │    │
│  │  │  GET  /auth/google/callback     - Google callback      │   │    │
│  │  │  GET  /auth/github              - Start GitHub OAuth   │   │    │
│  │  │  GET  /auth/github/callback     - GitHub callback      │   │    │
│  │  │  GET  /auth/user                - Get current user     │   │    │
│  │  │  GET  /auth/logout              - Logout user          │   │    │
│  │  └────────────────────────────────────────────────────────┘   │    │
│  │                                                                 │    │
│  │  ┌─────────────────┐                                           │    │
│  │  │   CORS Config   │  - Allows: http://localhost:3000         │    │
│  │  │                 │  - Credentials: true                      │    │
│  │  └─────────────────┘                                           │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                          HTTP/REST API
                          (with cookies)
                                   │
┌──────────────────────────────────┴───────────────────────────────────────┐
│                         REACT.JS FRONTEND                                 │
│                        (Port 3000)                                        │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     React Router                                 │    │
│  │                                                                  │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │    │
│  │  │   Login     │  │ AuthSuccess  │  │     Dashboard        │  │    │
│  │  │   Page      │  │   Handler    │  │                      │  │    │
│  │  │             │  │              │  │  - User Avatar       │  │    │
│  │  │  [Google]   │  │  Redirects   │  │  - User Info         │  │    │
│  │  │   Button    ├─►│  to          ├─►│  - Provider Details  │  │    │
│  │  │             │  │  Dashboard   │  │  - Logout Button     │  │    │
│  │  │  [GitHub]   │  │              │  │                      │  │    │
│  │  │   Button    │  │              │  │                      │  │    │
│  │  └─────────────┘  └──────────────┘  └──────────────────────┘  │    │
│  │                                                                  │    │
│  │     Route: /         Route: /auth/success    Route: /dashboard  │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        Axios HTTP Client                         │    │
│  │                   (withCredentials: true)                        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## OAuth2.0 Authentication Flow

```
┌──────────┐                                                    ┌──────────────┐
│  User    │                                                    │   OAuth      │
│ Browser  │                                                    │  Provider    │
└────┬─────┘                                                    │ (Google/     │
     │                                                          │  GitHub)     │
     │                                                          └───────┬──────┘
     │                                                                  │
     │  1. Click "Login with Google/GitHub"                            │
     ├──────────────────────────────────►                              │
     │                                   │                             │
     │                                   │ 2. Redirect to              │
     │                                   │    /auth/google or          │
     │                                   │    /auth/github             │
     │                                   ▼                             │
     │                          ┌─────────────────┐                    │
     │                          │   Node.js       │                    │
     │                          │   Backend       │                    │
     │                          │                 │                    │
     │                          │  - Passport.js  │ 3. Redirect to     │
     │                          │    initiates    ├───────────────────►│
     │                          │    OAuth flow   │    OAuth Provider  │
     │                          │                 │    with Client ID  │
     │                          └─────────────────┘                    │
     │                                   ▲                             │
     │                                   │                             │
     │  4. OAuth Provider login page     │                             │
     │◄──────────────────────────────────┼─────────────────────────────┤
     │                                   │                             │
     │  5. User grants permission        │                             │
     ├───────────────────────────────────┼────────────────────────────►│
     │                                   │                             │
     │                                   │  6. Authorization code      │
     │                                   │◄────────────────────────────┤
     │                                   │     sent to callback URL    │
     │                          ┌─────────────────┐                    │
     │                          │   Backend       │                    │
     │                          │   /callback     │                    │
     │                          │                 │ 7. Exchange code   │
     │                          │  - Receives     │    for access      │
     │                          │    auth code    ├───────────────────►│
     │                          │  - Requests     │    token           │
     │                          │    access token │                    │
     │                          │                 │ 8. Access token    │
     │                          │                 │◄───────────────────┤
     │                          │                 │    + User profile  │
     │                          │  - Creates      │                    │
     │                          │    session      │                    │
     │                          │  - Sets cookie  │                    │
     │                          └─────────────────┘                    │
     │                                   │                             │
     │  9. Redirect to frontend          │                             │
     │     /auth/success?token=xxx       │                             │
     │◄──────────────────────────────────┤                             │
     │                                   │                             │
     │  10. Navigate to /dashboard       │                             │
     │      with session cookie          │                             │
     ├──────────────────────────────────►│                             │
     │                                   │                             │
     │  11. Fetch user data              │                             │
     │      GET /auth/user               │                             │
     ├──────────────────────────────────►│                             │
     │      (with session cookie)        │                             │
     │                                   │                             │
     │  12. User profile data            │                             │
     │◄──────────────────────────────────┤                             │
     │                                   │                             │
     │  13. Display dashboard            │                             │
     │                                   │                             │
     ▼                                   ▼                             ▼
```

## Component Structure

### Backend Components

```
backend/
├── server.js                    # Main Express server
│   ├── Express setup
│   ├── Middleware (CORS, session, passport)
│   ├── Routes (auth endpoints)
│   └── Server initialization
│
├── config/
│   └── passport.js             # Passport configuration
│       ├── Google Strategy
│       │   ├── clientID
│       │   ├── clientSecret
│       │   └── callback URL
│       │
│       ├── GitHub Strategy
│       │   ├── clientID
│       │   ├── clientSecret
│       │   └── callback URL
│       │
│       ├── serializeUser()
│       └── deserializeUser()
│
├── .env                        # Environment variables
│   ├── PORT
│   ├── SESSION_SECRET
│   ├── GOOGLE_CLIENT_ID
│   ├── GOOGLE_CLIENT_SECRET
│   ├── GITHUB_CLIENT_ID
│   ├── GITHUB_CLIENT_SECRET
│   └── FRONTEND_URL
│
└── package.json               # Dependencies
    ├── express
    ├── passport
    ├── passport-google-oauth20
    ├── passport-github2
    ├── express-session
    ├── cors
    └── dotenv
```

### Frontend Components

```
frontend/
├── src/
│   ├── App.js                  # Main app with routing
│   │   └── React Router
│   │       ├── / → Login
│   │       ├── /auth/success → AuthSuccess
│   │       └── /dashboard → Dashboard
│   │
│   ├── components/
│   │   ├── Login.js           # Login page
│   │   │   ├── Google OAuth button
│   │   │   ├── GitHub OAuth button
│   │   │   └── Redirects to backend OAuth endpoints
│   │   │
│   │   ├── AuthSuccess.js     # OAuth callback handler
│   │   │   └── Redirects to dashboard
│   │   │
│   │   └── Dashboard.js       # User dashboard
│   │       ├── Fetch user data (GET /auth/user)
│   │       ├── Display user info
│   │       │   ├── Avatar
│   │       │   ├── Name
│   │       │   ├── Email
│   │       │   └── Provider
│   │       └── Logout button
│   │
│   └── index.js               # React entry point
│
├── public/
│   └── index.html             # HTML template
│
├── .env                       # Environment variables
│   └── REACT_APP_API_URL
│
└── package.json              # Dependencies
    ├── react
    ├── react-dom
    ├── react-router-dom
    └── axios
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interaction                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                              │
│                                                                  │
│  User clicks OAuth button → Redirects to backend OAuth route    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                             │
│                                                                  │
│  1. Passport initiates OAuth flow                               │
│  2. Redirects to OAuth Provider                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  OAuth Provider (Google/GitHub)                  │
│                                                                  │
│  1. User authenticates                                          │
│  2. User grants permissions                                     │
│  3. Redirects back with authorization code                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Backend Callback (/auth/*/callback)                 │
│                                                                  │
│  1. Exchange code for access token                              │
│  2. Fetch user profile                                          │
│  3. Create session                                              │
│  4. Set HTTP-only cookie                                        │
│  5. Redirect to frontend                                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Frontend (Dashboard)                             │
│                                                                  │
│  1. Fetch user data with session cookie                         │
│  2. Display user information                                    │
│  3. Allow logout                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Security Features

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Measures                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✓ Session-based authentication                                 │
│    └─ HTTP-only cookies (XSS protection)                        │
│                                                                  │
│  ✓ CORS configuration                                           │
│    ├─ Specific origin allowed (not *)                          │
│    └─ Credentials enabled                                       │
│                                                                  │
│  ✓ Environment variables                                        │
│    └─ Sensitive data not in code                               │
│                                                                  │
│  ✓ OAuth2.0 standard flow                                       │
│    ├─ No password handling                                      │
│    ├─ Delegated authentication                                  │
│    └─ Secure token exchange                                     │
│                                                                  │
│  ✓ Session secret                                               │
│    └─ Random key for session encryption                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack Summary

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    Frontend      │────►│     Backend      │────►│  OAuth Providers │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│                  │     │                  │     │                  │
│  • React 18      │     │  • Node.js       │     │  • Google OAuth  │
│  • React Router  │     │  • Express.js    │     │  • GitHub OAuth  │
│  • Axios         │     │  • Passport.js   │     │                  │
│  • CSS3          │     │  • Sessions      │     │                  │
│                  │     │  • CORS          │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

