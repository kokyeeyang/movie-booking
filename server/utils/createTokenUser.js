const createTokenUser = (user) => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    userId: user._id,
    role: user.role,
  };
};

module.exports = createTokenUser;
