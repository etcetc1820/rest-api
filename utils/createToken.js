const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
  const secret = process.env.SECRET || "secret";
  const expirationTime = 10; // minutes

  return jwt.sign(data, secret, {
    expiresIn: 60 * expirationTime,
  });
};
