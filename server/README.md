# EcoFinds Backend

Backend API for EcoFinds - Sustainable Second-Hand Marketplace

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy config.env to .env and update values
cp config.env .env
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your_jwt_secret_key_here
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?q=search&category=Electronics&page=1&limit=12
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Vintage Camera",
  "description": "Great condition vintage camera",
  "category": "Electronics",
  "price": 150.00,
  "imagePlaceholder": "https://example.com/image.jpg"
}
```

#### Update Product
```http
PUT /api/products/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 200.00
}
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <jwt_token>
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <jwt_token>
```

#### Add to Cart
```http
POST /api/cart/add/:productId
Authorization: Bearer <jwt_token>
```

#### Remove from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <jwt_token>
```

#### Checkout
```http
POST /api/cart/checkout
Authorization: Bearer <jwt_token>
```

#### Get Purchases
```http
GET /api/cart/purchases
Authorization: Bearer <jwt_token>
```

## Models

### User Model
```javascript
{
  email: String (required, unique)
  passwordHash: String (required)
  username: String (required)
  avatarUrl: String (default: placeholder)
  cart: [ObjectId] (ref: Product)
  purchases: [ObjectId] (ref: Product)
  createdAt: Date
  updatedAt: Date
}
```

### Product Model
```javascript
{
  owner: ObjectId (ref: User, required)
  title: String (required)
  description: String (required)
  category: String (required, enum)
  price: Number (required, min: 0)
  imagePlaceholder: String (default: placeholder)
  isSold: Boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

## Error Handling

All endpoints return consistent error responses:

```javascript
{
  "message": "Error description",
  "error": "Detailed error message" // Only in development
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
