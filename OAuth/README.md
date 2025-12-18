# OAuth2.0 Social Login Project

A full-stack application implementing OAuth2.0 social login with React.js frontend and Node.js backend.

## Features

- Google OAuth2.0 authentication
- GitHub OAuth2.0 authentication
- Session-based authentication
- Modern, responsive UI
- Secure cookie handling

## Project Structure

```
backend/
├── backend/          # Node.js backend server
│   ├── config/      # Passport.js configuration
│   ├── server.js    # Express server
│   └── package.json
└── frontend/        # React.js frontend
    ├── src/
    │   ├── components/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google OAuth2.0 credentials
- GitHub OAuth2.0 credentials

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your OAuth2.0 credentials in `.env`:

#### Google OAuth2.0 Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

#### GitHub OAuth2.0 Setup:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` if your backend runs on a different port:
```
REACT_APP_API_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Start both servers (backend and frontend)
2. Open your browser and navigate to `http://localhost:3000`
3. Click on "Continue with Google" or "Continue with GitHub"
4. Complete the OAuth flow
5. You'll be redirected to the dashboard showing your user information

## API Endpoints

### Backend Endpoints:

- `GET /` - Health check
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/user` - Get current authenticated user
- `GET /auth/logout` - Logout user

## Security Notes

- In production, use HTTPS
- Set `secure: true` in session cookie configuration
- Use environment variables for all secrets
- Consider implementing JWT tokens instead of storing access tokens
- Add rate limiting and CSRF protection

## Technologies Used

### Backend:
- Express.js
- Passport.js
- express-session
- cors
- dotenv

### Frontend:
- React.js
- React Router
- Axios
- CSS3

## License

ISC

