const CustomError = require("../errors");
const { isTokenValid } = require("../utils");
const Token = require("../models/Token");
const { attachCookiesToResponse } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.cookies;
  console.log("🍪 accessToken:", accessToken);
  console.log("🍪 refreshToken:", refreshToken);

  try {
    if (accessToken) {
      try {
        const payload = isTokenValid(accessToken);
        console.log("✅ Access token valid. User:", payload.user);
        req.user = payload.user;
        return next();
      } catch (err) {
        console.warn("⚠️ Access token invalid/expired");
      }
    }

    console.log("🔁 Falling back to refresh token...");
    const payload = isTokenValid(refreshToken);
    console.log("✅ Refresh token payload:", payload);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken,
    });

    console.log("🔍 Token from DB:", existingToken);

    if (!existingToken || !existingToken.isValid) {
      console.error("❌ No valid refresh token found");
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    return next();
  } catch (error) {
    console.error("❌ authenticateUser error:", error.message);
    return res.status(401).json({ msg: "Authentication Invalid" });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
