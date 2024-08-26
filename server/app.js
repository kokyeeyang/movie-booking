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

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/cinema", cinemaRouter);
app.use("/api/v1/movieListing", movieListingRouter);

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
