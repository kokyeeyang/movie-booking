const express = require("express");
const Stripe = require("stripe");
const app = express();
const stripe = Stripe("sk_test_51QDe7hJBWqEZm7T0UULpU5Jxqf0d4RnUiCIhO9z5h9FV2h4fQuUatpN0TEcprUcdbkBaNIDyreIDEFK1JgLfmCyB00Q9cAlBO1");

require("dotenv").config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
});

const connectDB = require("./db/connect");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// Routers
const authRouter = require("./routes/authRoutes");
const movieRouter = require("./routes/movieRoutes");
const cinemaRouter = require("./routes/cinemaRoutes");
const movieListingRouter = require("./routes/movieListingRoutes");
const customerRouter = require("./routes/customerRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const membershipPointsRouter = require("./routes/membershipPointsRoutes");
const userRouter = require("./routes/userRoutes");
const cronRouter = require("./routes/cronRoutes");

const port = process.env.PORT || 5000;

// CORS config
const allowedOrigins = [
  "https://bookanymovie.netlify.app",
  "http://localhost:3000",
  "https://bookanymovie-staging.netlify.app",
  "http://192.168.49.2:31104",
  "http://afffcc63c42134734b7509c9bdb6c304-150786702.ap-southeast-1.elb.amazonaws.com",
  "http://a5e18e3a257e34c3285f364f207dcab6-1140972258.ap-southeast-1.elb.amazonaws.com", // backend
  "https://moviebooking.dev",      // ✅ Add this
  "https://api.moviebooking.dev",
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^http:\/\/localhost:\d+$/,
  // Add your Kubernetes service URLs if needed
  /^http:\/\/.*\.local:\d+$/,
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("🔍 CORS check for origin:", origin);
    
    if (
      !origin ||
      allowedOrigins.some((allowed) =>
        typeof allowed === "string"
          ? allowed === origin
          : allowed instanceof RegExp
          ? allowed.test(origin)
          : false
      )
    ) {
      console.log("✅ CORS allowed for:", origin);
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie'],
};

// Use relaxed CORS in development
if (process.env.NODE_ENV === "production") {
  app.use(cors(corsOptions));
} else {
  console.log("🔧 Development mode: Using relaxed CORS");
  app.use(cors({ 
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept', 'Origin'],
  }));
}

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  console.log("🔍 Headers:", req.headers);
  console.log("🍪 Cookies:", req.cookies);
  next();
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/cinema", cinemaRouter);
app.use("/api/v1/movieListing", movieListingRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/membershipPoints", membershipPointsRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cron", cronRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Stripe endpoint
app.post("/create-payment-intent", async (req, res) => {
  const { totalPrice, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: currency || "myr",
      payment_method_types: ["card"],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Server start
const start = async () => {
  try {
    console.log("MONGO_URL =", process.env.MONGO_URL);
    await connectDB(process.env.MONGO_URL);
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

start();