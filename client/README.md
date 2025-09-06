# EcoFinds Frontend

React frontend for EcoFinds - Sustainable Second-Hand Marketplace

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Pages
- **Home** - Product feed with search and filtering
- **Login/Register** - Authentication forms
- **Product Detail** - Individual product view
- **Add Product** - Create new product listing
- **My Listings** - Manage your products
- **Cart** - Shopping cart and checkout
- **Dashboard** - User statistics and activity
- **Purchases** - View purchase history

### Components
- **Layout** - Main layout with navigation
- **ProtectedRoute** - Route protection for authenticated users
- **AuthContext** - Authentication state management

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout wrapper
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProductDetail.jsx
│   ├── AddProduct.jsx
│   ├── MyListings.jsx
│   ├── Cart.jsx
│   ├── Dashboard.jsx
│   └── Purchases.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Styling

The app uses Tailwind CSS with custom configuration:

- **Primary Colors**: Green theme for sustainability
- **Secondary Colors**: Gray scale for neutral elements
- **Custom Components**: Reusable button and input styles
- **Responsive Design**: Mobile-first approach

## State Management

- **Authentication**: AuthContext with localStorage persistence
- **API Calls**: Axios with automatic token handling
- **Local State**: React hooks for component state

## API Integration

All API calls are made to the backend server running on port 5000. The Vite dev server is configured to proxy API requests to avoid CORS issues.

## Environment Variables

No environment variables are required for the frontend. The API base URL is configured in `vite.config.js`.

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
