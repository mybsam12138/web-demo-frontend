# Web Demo Frontend

Frontend demo application showcasing OAuth integration with Google and Twitter. Built with Vue 3, TypeScript, Vite, and Vuetify.

Test it:www.niudiantask.cn


## Features

- ✅ Google OAuth 2.0 login
- ✅ Twitter OAuth 1.0 login
- ✅ Modern UI with Vuetify
- ✅ TypeScript support
- ✅ Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Configuration

Make sure your backend is running on `http://localhost:8080` and has the OAuth endpoints configured:

- `GET /api/oauth/authorize/{provider}` - Get authorization URL
- `GET /api/oauth/callback/{provider}` - Handle OAuth callback

## OAuth Flow

1. User clicks on Google or Twitter login button
2. Frontend calls backend to get authorization URL
3. User is redirected to OAuth provider
4. After authorization, provider redirects to `/callback/{provider}`
5. Frontend processes the callback and displays user information

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```
