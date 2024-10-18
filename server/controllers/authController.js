const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const login = async (req, res) => {
  console.log("made it to the backend!!!");
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide an email address or password"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Invalid credentials");
  }
  const tokenUser = createTokenUser(user);

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  console.log(existingToken);

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
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
  if (user.isVerified != true) {
    throw new CustomError.BadRequestError("Please verify your account first");
  }
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: false,
    expires: new Date(Date.now()),
    signed: true,
    sameSite: "None",
    path: "/",
    secure: true,
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: false,
    expires: new Date(Date.now()),
    secure: true,
    signed: true,
    sameSite: "None",
    path: "/",
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
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
