# EcoFinds - Sustainable Second-Hand Marketplace

A full-stack MERN application for buying and selling second-hand items in a sustainable way. Built with Node.js, Express, MongoDB, React, Vite, and Tailwind CSS.

## Features

### Backend Features
- **JWT Authentication** with email and password
- **User Management** with profile, cart, and purchase tracking
- **Product CRUD** operations with category filtering and search
- **Quantity Management** - products can have multiple quantities
- **Cart System** with add/remove functionality and quantity controls
- **Simple Checkout Process** that moves items to purchases and updates quantities
- **Smart Inventory** - quantities decrease on purchase, products stay visible until sold out
- **RESTful API** with proper error handling and validation

### Frontend Features
- **Modern React UI** with Vite and Tailwind CSS
- **Responsive Design** for desktop and mobile
- **Authentication Flow** with login/register forms
- **Product Feed** with search and category filtering
- **Product Management** for sellers (add, edit, delete) with quantity support
- **Shopping Cart** with quantity controls and simple checkout
- **User Dashboard** with statistics and recent activity
- **Protected Routes** for authenticated users
- **Real-time Quantity Updates** - see available stock on products

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios for API calls
- Lucide React for icons

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp config.env.example .env

# Edit the .env file with your MongoDB URI and JWT secret
```

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

### Database Setup

Make sure MongoDB is running on your system. The application will automatically create the necessary collections when you start using it.

For MongoDB Atlas:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your server's `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with search and filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected, owner only)
- `DELETE /api/products/:id` - Delete product (protected, owner only)
- `GET /api/products/user/my-products` - Get user's products (protected)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add/:productId` - Add product to cart (protected)
- `DELETE /api/cart/remove/:productId` - Remove product from cart (protected)
- `POST /api/cart/checkout` - Checkout cart (protected)
- `GET /api/cart/purchases` - Get user's purchases (protected)

## Usage

1. **Register/Login**: Create an account or login to access all features
2. **Browse Products**: Search and filter products by category
3. **Add Products**: List your own items for sale
4. **Shopping Cart**: Add items to cart and checkout
5. **Dashboard**: View your statistics and recent activity
6. **Manage Listings**: Edit or delete your products

## Project Structure

```
ecofinds/
├── server/                 # Backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
