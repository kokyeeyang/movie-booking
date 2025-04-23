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

  try {
    console.log("Setting accessToken cookie");
    res.cookie("accessToken", accessTokenJWT, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production", // Secure for production
      sameSite: "None", // Allow cross-site cookies
      path: "/",
      domain: "bookanymovie.netlify.app", // Set the domain to the Netlify app domain
    });

    console.log("Setting refreshToken cookie");
    res.cookie("refreshToken", refreshTokenJWT, {
      httpOnly: true,
      expires: new Date(Date.now() + longerExp),
      secure: process.env.NODE_ENV === "production", // Secure for production
      sameSite: "None", // Allow cross-site cookies
      path: "/",
      domain: "bookanymovie.netlify.app", // Set the domain to the Netlify app domain
    });

    console.log("Cookies set successfully!");
  } catch (error) {
    console.log("Error setting cookies:", error);
  }
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
