# 🍳 FOODIE – Full-Stack Food Recipe Application

A modern, professional, fully functional full-stack food recipe web application built with **React.js, Node.js, Express.js, and MongoDB (Atlas / Local)**.

![FOODIE Banner](https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Highlights & Features

- **Warm Cream & Amber Palette**: Designed with warm cream (`#FAF7F2`), chocolate brown (`#4A2E1B`), and warm orange (`#E26D24`) accents.
- **18 Fully Functional Pages**: Every single page is connected to backend REST APIs and MongoDB.
- **Real MongoDB Persistence**: User profiles, recipes, favorites, and reviews are permanently stored in MongoDB.
- **Dynamic Unlimited Recipe Publishing**: Add unlimited recipes with food photography upload (via Multer), dynamic ingredient lists, and sequential cooking steps.
- **Instant Favourite System**: Heart icon with optimistic UI updates and backend MongoDB synchronization.
- **Interactive Ratings & Reviews**: 1 to 5 star ratings, comment feedback, and automatic recipe average recalculation.
- **Full-Text Search & Filters**: Search by recipe title, ingredients, or cuisine. Filter by category, difficulty, prep/cook time, and vegetarian/non-vegetarian preferences.
- **Complete CRUD Operations**: Create, Read, Update, and Delete your own recipes with security ownership verification.

---

## 🏗️ Technology Stack

### Frontend
- **React.js 19** (Vite build tool)
- **React Router DOM 7** (Client-side routing with route guards)
- **Axios** (Centralized API client with interceptors)
- **Lucide React** (Modern, clean icon set)
- **CSS3** (Custom design system, glassmorphism, responsive grids)

### Backend
- **Node.js** & **Express.js**
- **JWT (JSON Web Tokens)** (Stateless authentication)
- **bcryptjs** (Password hashing & salting)
- **Multer** (Recipe & profile image upload engine with validation)
- **Helmet & CORS** (Security headers & cross-origin policies)
- **Morgan** (HTTP request logging)

### Database
- **MongoDB** (MongoDB Atlas or Local MongoDB Server)
- **Mongoose ODM** (Strict schemas, pre/post hooks, compound indexing)

---

## 📂 Project Structure

```text
foodie-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection to MongoDB Atlas / Local
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, JWT issuance, profile
│   │   ├── recipeController.js   # Full CRUD, Multer file handling, filters
│   │   ├── favoriteController.js # MongoDB-backed user favorites
│   │   ├── reviewController.js   # Star ratings, reviews, rating recalculation
│   │   └── userController.js     # Profile update, password change
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification guard
│   │   ├── uploadMiddleware.js   # Multer configuration (JPG/PNG/WEBP, 5MB limit)
│   │   └── errorMiddleware.js    # Centralized error & 404 handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hook
│   │   ├── Recipe.js             # Recipe schema with 10 categories enum
│   │   ├── Favorite.js           # Unique compound index { user, recipe }
│   │   └── Review.js             # Review schema with static recalculate method
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   └── seedRecipes.js        # Seeds the 10 required sample recipes
│   ├── uploads/                  # Uploaded food photography storage
│   ├── test-flow.js              # Complete 16-step automated test suite
│   ├── .env                      # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Main Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Sticky navigation, logo, user dropdown, mobile drawer
│   │   │   ├── Footer.jsx        # Rich footer with links, categories, newsletter
│   │   │   ├── RecipeCard.jsx    # Interactive card with MongoDB heart button
│   │   │   ├── CategoryCard.jsx  # Category visual card with recipe count
│   │   │   ├── RatingStars.jsx   # 5-star rating display & interactive picker
│   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   └── Toast.jsx         # Custom notifications
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global login state, token, me endpoint
│   │   │   └── FavoriteContext.jsx# MongoDB-backed favorites state & toggle
│   │   ├── pages/
│   │   │   ├── SplashPage.jsx    # 1. Splash / Welcome Page
│   │   │   ├── LoginPage.jsx     # 2. Login Page with demo chef login
│   │   │   ├── RegisterPage.jsx  # 3. Registration Page
│   │   │   ├── HomePage.jsx      # 4. Dynamic Home Page with MongoDB feeds
│   │   │   ├── AllRecipesPage.jsx# 5. All Recipes with chips & sorting
│   │   │   ├── CategoriesPage.jsx# 6. 10 Curated Culinary Categories
│   │   │   ├── RecipeDetailsPage.jsx # 7. Recipe Details, checklist & reviews
│   │   │   ├── FavoriteRecipesPage.jsx # 8. Personal MongoDB Favourites
│   │   │   ├── AddRecipePage.jsx # 9. Dynamic Recipe Publishing
│   │   │   ├── MyRecipesPage.jsx # 10. User's Authored Recipes
│   │   │   ├── EditRecipePage.jsx# 11. Edit Own Recipe
│   │   │   ├── SearchRecipesPage.jsx # 12. Full-Text Search & Multi-filter
│   │   │   ├── UserProfilePage.jsx   # 13. Chef Profile & statistics
│   │   │   ├── EditProfilePage.jsx   # 14. Edit Profile, avatar & password
│   │   │   ├── ReviewsPage.jsx   # 15. Community Reviews & Ratings
│   │   │   ├── SettingsPage.jsx  # 16. App Preferences & MongoDB status
│   │   │   ├── AboutUsPage.jsx   # 17. Story, mission & architecture
│   │   │   └── ContactPage.jsx   # 18. Contact Form & FAQ accordion
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   └── index.css         # Design tokens, variables & typography
│   │   ├── App.jsx               # Routes configuration
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🗄️ Database: The 10 Seeded Sample Recipes

The application seeds 10 authentic recipes directly into MongoDB:
1. **Chicken Biryani** (Non-Vegetarian, Hyderabadi Dum style)
2. **Chilli Chicken** (Fast Food, Indo-Chinese crispy wok style)
3. **Chicken 65** (Snacks, South Indian spiced starter)
4. **Paneer Butter Masala** (Vegetarian, Restaurant style makhani)
5. **Veg Fried Rice** (Dinner, Wok tossed jasmine rice)
6. **Masala Dosa** (Breakfast, Crispy crepe with potato masala)
7. **Pizza** (Fast Food, Italian artisan blistered crust)
8. **Pasta** (Lunch, Penne all'Arrabbiata)
9. **Chocolate Cake** (Desserts, Triple fudge dark chocolate)
10. **Gulab Jamun** (Traditional Food, Rose-saffron soaked milk dumplings)

Plus, the default author **Chef Rahul Sharma** (`chef@foodie.com` / `password123`) is created.

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a free MongoDB Atlas connection string)

### 2. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
# For Local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/foodie_db

# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodie?retryWrites=true&w=majority

JWT_SECRET=foodie_secret_key_recipe_hub_2026_jwt_token
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed MongoDB
In the `backend` folder:
```bash
npm run seed
```

### 4. Start the Backend API Server
```bash
cd backend
npm run dev
# or: node server.js
```
The server will start at: `http://localhost:5000`

### 5. Start the React Frontend
In a new terminal window:
```bash
cd frontend
npm run dev
```
The frontend will start at: `http://localhost:5173`

---

## 🧪 Verification & Testing

To run the automated 16-step test verification suite:
```bash
cd backend
node test-flow.js
```

All 16 steps test:
- User registration in MongoDB
- Bcrypt password validation & JWT login
- Reading all recipes and categories
- Full-text keyword search
- Adding & removing favorites in MongoDB
- Publishing a completely new dynamic recipe with ingredients & instructions
- Review & star rating recalculation
- Owner recipe editing
- Recipe deletion and cleanup

---

## 🚀 Public Deployment Guide

### Backend (Render / Railway / Heroku)
1. Push project to your GitHub repository.
2. In Render, create a new **Web Service** pointing to the `backend/` directory.
3. Set the build command: `npm install`
4. Set the start command: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: Your deployed frontend URL

### Frontend (Vercel / Netlify)
1. In Vercel or Netlify, import the repository and set the **Root Directory** to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
   - `VITE_SERVER_URL`: `https://your-backend-app.onrender.com`
