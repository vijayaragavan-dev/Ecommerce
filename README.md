# ShopLux E-Commerce Application

A full-stack e-commerce website built with Spring Boot (Java) backend and vanilla HTML/CSS/JS frontend with MySQL database.

## Project Structure

```
ecommerce/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/ecommerce/
│   │       │   ├── config/          # Configuration classes
│   │       │   ├── controller/      # REST API Controllers
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── model/           # Entity classes
│   │       │   ├── repository/      # JPA Repositories
│   │       │   ├── security/        # JWT & Security
│   │       │   └── service/         # Business Logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                # Frontend
│   ├── css/
│   │   └── styles.css       # Main styles
│   ├── js/
│   │   ├── api.js           # API calls
│   │   └── main.js          # Main functionality
│   ├── index.html           # Home page
│   ├── products.html        # Product listing
│   ├── product-detail.html  # Product details
│   ├── cart.html            # Shopping cart
│   ├── login.html           # Login/Register
│   ├── checkout.html        # Checkout
│   └── admin.html           # Admin panel
└── README.md
```

## Prerequisites

### Backend Requirements:
- Java 17 or higher
- Maven 3.8+
- MySQL 8.0+

### Frontend Requirements:
- Modern web browser
- VS Code Live Server or any local web server

## Database Setup

### 1. Install MySQL
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

### 2. Create Database
The application will automatically create the database. 
However, you can create it manually:

```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure MySQL Password
Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_PASSWORD_HERE
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Build the Project
```bash
mvn clean install -DskipTests
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The backend will start on: http://localhost:8080

### 4. Default Credentials (Auto-created)
- **Admin**: admin@ecommerce.com / admin123
- **User**: user@ecommerce.com / user123

## Frontend Setup

### 1. Using VS Code Live Server (Recommended)
1. Open the `frontend` folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` and select "Open with Live Server"

### 2. Using Python
```bash
cd frontend
python -m http.server 5500
```

### 3. Using Node.js
```bash
npx serve frontend
```

The frontend will be available at: http://localhost:5500

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - List all products (paginated)
- GET `/api/products/{id}` - Get product by ID
- GET `/api/products/featured` - Get featured products
- GET `/api/products/search?q=query` - Search products
- GET `/api/products/category/{category}` - Get by category
- GET `/api/products/categories` - Get all categories
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/{id}` - Update product (Admin)
- DELETE `/api/products/{id}` - Delete product (Admin)

### Cart
- GET `/api/cart` - Get cart items
- GET `/api/cart/total` - Get cart total
- GET `/api/cart/count` - Get cart item count
- POST `/api/cart/add?productId=X&quantity=Y` - Add to cart
- PUT `/api/cart/{id}?quantity=X` - Update quantity
- DELETE `/api/cart/{id}` - Remove item
- DELETE `/api/cart/clear` - Clear cart

### Orders
- GET `/api/orders` - Get user orders
- GET `/api/orders/all` - Get all orders (Admin)
- GET `/api/orders/{id}` - Get order by ID
- POST `/api/orders/checkout` - Place order
- PUT `/api/orders/{id}/status?status=STATUS` - Update status (Admin)

## Features

### Frontend Features:
- ✅ Hero slider with animations
- ✅ Product grid with filtering/sorting
- ✅ Search functionality
- ✅ Shopping cart
- ✅ User authentication
- ✅ Checkout process
- ✅ Admin panel for product/order management
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading animations

### Backend Features:
- ✅ JWT authentication
- ✅ RESTful API
- ✅ MySQL database integration
- ✅ Product CRUD operations
- ✅ Cart management
- ✅ Order management
- ✅ Admin role management
- ✅ Auto-seed data

## Environment Variables

You can customize settings in `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE

# JWT
jwt.secret=YOUR_JWT_SECRET_HERE
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:5500,http://127.0.0.1:5500
```

## Troubleshooting

### MySQL Connection Issues:
1. Ensure MySQL is running
2. Check username/password
3. Verify database exists

### Frontend Not Loading:
1. Check browser console for errors
2. Ensure backend is running on port 8080
3. Check CORS settings

### JWT Token Issues:
1. Clear browser localStorage
2. Login again
3. Check token expiration

## License

This project is for educational purposes.
