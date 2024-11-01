const express = require("express");
const Stripe = require("stripe");
const app = express();
const stripe = Stripe(
  "sk_test_51QDe7hJBWqEZm7T0UULpU5Jxqf0d4RnUiCIhO9z5h9FV2h4fQuUatpN0TEcprUcdbkBaNIDyreIDEFK1JgLfmCyB00Q9cAlBO1"
);

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
  "https://bookanymovie.netlify.app", // Your production frontend URL
  "http://localhost:3000", // Your local development URL
];

// app.use(
//   cors({
//     // origin: "http://localhost:3000",
//     origin: process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000",
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
app.use("/api/v1/customer", customerRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/create-payment-intent", async (req, res) => {
  const { totalPrice, currency } = req.body; // receive totalPrice from frontend

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Amount is in cents, so multiply by 100
      currency: currency || "RM",
      payment_method_types: ["card"],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
