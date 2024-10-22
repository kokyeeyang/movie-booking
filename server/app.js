const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./db/connect");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const movieRouter = require("./routes/movieRoutes");
const cinemaRouter = require("./routes/cinemaRoutes");
const movieListingRouter = require("./routes/movieListingRoutes");
const customerRouter = require("./routes/customerRoutes");

const port = process.env.PORT || 5000;

const allowedOrigins = [
  'https://bookanymovie.netlify.app', // Your production frontend URL
  'http://localhost:3000' // Your local development URL
];

// app.use(
//   cors({
//     // origin: "http://localhost:3000",
//     origin: process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // If you need to send cookies or authentication headers
}));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/cinema", cinemaRouter);
app.use("/api/v1/movieListing", movieListingRouter);
app.use("/api/v1/customer", customerRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
