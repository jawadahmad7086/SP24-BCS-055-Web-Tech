require('dotenv').config();

// Import the express module
let express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const { isAdmin } = require('./middleware/auth');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Initialize an express application
let app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: 'nikeclone_super_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/ecommerce' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Flash messages
app.use(flash());

// Global middleware for views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// API v1 Routes
const apiAuthRoutes = require('./routes/api/v1/auth');
const apiProductsRoutes = require('./routes/api/v1/products');
const apiOrdersRoutes = require('./routes/api/v1/orders');
const apiUserRoutes = require('./routes/api/v1/user');

app.use('/', authRoutes);
app.use('/admin', isAdmin, adminRoutes);

// Mount API v1 Routes
app.use('/api/v1/auth', apiAuthRoutes);
app.use('/api/v1/products', apiProductsRoutes);
app.use('/api/v1/orders', apiOrdersRoutes);
app.use('/api/v1/user', apiUserRoutes);

// Define a route for the root URL ('/')
app.get("/", function (req, res) {
  // Render the 'index.ejs' view
  return res.render("index");
});

app.get("/products", async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    res.render("products", {
      products,
      currentPage: page,
      totalPages,
      query: req.query
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});
// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server Started at http://localhost:3000");
});
