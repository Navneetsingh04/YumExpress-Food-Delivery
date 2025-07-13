# YumExpress - Food Delivery Application

YumExpress is a full-stack food delivery application built with modern web technologies. It provides a complete solution for online food ordering with separate interfaces for customers, administrators, and order management.

## 🚀 Project Structure

This project consists of three main components:

- **Frontend** - Customer-facing React application for food ordering
- **Backend** - Node.js/Express API server with MongoDB integration
- **Admin** - Administrative panel for managing foods, orders, and users

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - User interface library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Admin Panel
- **React 19.0.0** - User interface library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Navneetsingh04/YumExpress-Food-Delivery-.git
cd YumExpress
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Create .env file with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# PORT=4000

npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### 4. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/yumexpress
JWT_SECRET=your_jwt_secret_key
PORT=4000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   Server runs on `http://localhost:4000`

2. **Start Frontend Application**
   ```bash
   cd Frontend
   npm run dev
   ```
   Application runs on `http://localhost:5173`

3. **Start Admin Panel**
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel runs on `http://localhost:5174`


## 📱 Features

### Customer Features
- User registration and authentication
- Browse food items by categories
- Add items to cart
- Place orders with delivery details
- Secure payment integration
- Order tracking
- User profile management

### Admin Features
- Admin authentication
- Add/Edit/Delete food items
- Manage food categories
- View and manage orders
- User management
- Dashboard with analytics

### Backend Features
- RESTful API architecture
- JWT-based authentication
- File upload for food images
- Order management system
- Payment processing
- Database operations with MongoDB


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

**Navneet Singh**
- GitHub: [@Navneetsingh04](https://github.com/Navneetsingh04)
