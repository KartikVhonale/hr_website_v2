# TalentFlow Frontend

React + Vite frontend application for the TalentFlow HR platform.

## 🚀 Deployment

This application is configured for deployment on Vercel.

### Environment Variables

Set the following environment variable in your Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
VITE_API_URL=http://localhost:3000
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📦 Tech Stack

- **React 19** - UI Framework
- **Vite 7** - Build Tool
- **Tailwind CSS 3** - Styling
- **React Router 7** - Routing
- **Native Fetch API** - HTTP Client (no axios dependency)

## 🔧 Features

- Modern React with hooks
- Responsive design with Tailwind CSS
- Client-side routing
- Authentication system
- Job management
- User profiles
- File upload (resume handling)
- Admin dashboard

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service functions
├── context/       # React context providers
├── utils/         # Utility functions
├── css/           # Stylesheets
└── assets/        # Static assets
```

## 🌐 API Integration

The frontend communicates with the backend API using a custom HTTP client built on the native Fetch API. All API calls are configured to use the `VITE_API_URL` environment variable.
