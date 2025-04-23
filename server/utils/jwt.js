const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, token }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, token } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  // Determine the domain based on environment
  const cookieDomain =
    process.env.NODE_ENV === "production"
      ? "bookanymovie.netlify.app"  // Production domain (Netlify)
      : "localhost";  // Development domain (localhost)

  // Set cookies with appropriate domain for Netlify and CORS settings
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,  // Ensures cookie is not accessible via JavaScript (security)
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",  // Only secure in production
    sameSite: "None",  // Allow cross-origin cookies
    path: "/",
    domain: cookieDomain,  // Dynamically set the domain based on environment
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + longerExp),
    secure: process.env.NODE_ENV === "production",  // Only secure in production
    sameSite: "None",  // Allow cross-origin cookies
    path: "/",
    domain: cookieDomain,  // Dynamically set the domain based on environment
  });
};

// const attachSingleCookieToResponse = ({ res, user }) => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;
//   const fiveSeconds = 1000 * 5;

//   res.cookie('token', token, {
//     httpOnly: true,
//     // expires: new Date(Date.now() + oneDay),
//     expires: new Date(Date.now() + fiveSeconds),
//     secure: process.env.NODE_ENV === 'production',
//     signed: true,
//   });
// };

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
