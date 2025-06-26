const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
// require("dotenv").config();
const dotenv = require('dotenv');

// Load the environment variables
// dotenv.config();
const isProdLike = ["production", "staging"].includes(process.env.NODE_ENV);
const isDockerLocal = process.env.IS_DOCKER_LOCAL === "true";

const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");

const login = async (req, res) => {
  console.log("made it to the backend!!!");
  console.log('new log!');
  const { email, password } = req.body;
  console.log('skaffold is ready!')
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide an email address or password"
    );
  }

  const user = await User.findOne({ email });
  console.log('user hello ');
  console.log(user.isVerified);
  if (!user) {
    // throw new CustomError.BadRequestError("Invalid credentials");
    return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Invalid credentials"});
  }
  if (user.isVerified == false) {
    console.log('user is not verified!');
    // throw new CustomError.BadRequestError("Please verify your account first");
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "Please verify your account first"});
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    // throw new CustomError.BadRequestError("Invalid credentials");
    return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Invalid credentials"});
  }
  const tokenUser = createTokenUser(user);

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      // throw new CustomError.UnauthenticatedError("Invalid Credentials");
      return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Invalid credentials"});
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenUser, refreshToken });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;
  const userToken = { refreshToken, userAgent, ipAddress, user: user._id };

  await Token.create(userToken);
  console.log(user);
  console.log('hwhewh')
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  console.log("🚪 Logout endpoint hit");

  try {
    console.log("🧾 Attempting to delete token for user:", req.userId);
    await Token.findOneAndDelete({ user: req.userId });
    console.log("✅ Token deleted (if existed)");
  } catch (err) {
    console.error("❌ Error deleting token:", err);
  }

  try {
    console.log("🍪 Setting accessToken cookie...");

    res.cookie("accessToken", "logout", {
      httpOnly: false,
      expires: new Date(Date.now()),
      signed: true,
      sameSite: isProdLike && !isDockerLocal ? "None" : "Lax",
      path: "/",
      secure: isProdLike && !isDockerLocal,
    });

    console.log("🍪 Setting refreshToken cookie...");
    res.cookie("refreshToken", "logout", {
      httpOnly: false,
      expires: new Date(Date.now()),
      secure: isProdLike && !isDockerLocal,
      signed: true,
      sameSite: isProdLike && !isDockerLocal ? "None" : "Lax",
      path: "/",
    });
  } catch (err) {
    console.error("❌ Error setting cookies:", err);
  }

  try {
    console.log("📤 Sending logout success response");
    res.status(StatusCodes.OK).json({ msg: "User logged out!" });
  } catch (err) {
    console.error("❌ Error sending response:", err);
    res.status(500).json({ msg: "Logout failed unexpectedly" });
  }
};

const signup = async (req, res) => {
  try {
    const isFirstAccount = (await User.countDocuments({})) == 0;
    const role = isFirstAccount ? "admin" : "user";
    const verificationToken = crypto.randomBytes(40).toString("hex");
    console.log(req.body);
    const { firstname, lastname, email, username, password, confirmPassword } =
      req.body;
    if (password.length < 6 || confirmPassword.length < 6) {
      throw new CustomError.BadRequestError(
        "Please confirm that password or confirm password are longer than 6 characters"
      );
    }
    if (
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password) ||
      !/[^a-zA-Z0-9]/.test(password)
    ) {
      throw new CustomError.BadRequestError(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }

    if (confirmPassword !== password) {
      throw new CustomError.BadRequestError(
        "password and confirm password do not match"
      );
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new CustomError.BadRequestError(
        "An account already exists for this email, please proceed to login"
      );
    }
    const user = await User.create({
      firstname,
      lastname,
      role,
      email,
      verificationToken,
      password: password,
    });
    await sendVerificationEmail({
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      verificationToken: user.verificationToken,
      origin: process.env.FRONTEND_DOMAIN,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification failed!");
  }

  console.log(verificationToken);
  console.log(user.verificationToken);
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification failed!");
  }
  user.isVerified = true;
  // after verifying user, verification token is no longer needed
  user.verificationToken = "";
  user.verified = Date.now();
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "User successfully verified!" });
};

module.exports = { signup, verifyEmail, login, logout };
