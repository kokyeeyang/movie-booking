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
  console.log(accessTokenJWT);
  console.log(refreshTokenJWT);
  console.log("we are here");
  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;
  const fiveSeconds = 1000 * 5;

  try {
    console.log("Setting accessToken cookie");
    res.cookie("accessToken", accessTokenJWT, {
      httpOnly: false,
      expires: new Date(Date.now() + oneDay),
      secure: true,
      signed: true,
      sameSite: "none",
      // path: ".localhost",
      path: "/",
    });
    console.log("Setting refreshToken cookie");
    res.cookie("refreshToken", refreshTokenJWT, {
      httpOnly: false,
      expires: new Date(Date.now() + longerExp),
      secure: true,
      signed: true,
      sameSite: "none",
      // path: ".localhost",
      path: "/",
    });

    console.log("after setting the token");
  } catch (error) {
    console.log(error);
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
