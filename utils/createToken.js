const jwt = require("jsonwebtoken");

exports.createToken = (data, timeInMinutes) => {
  const secret = process.env.SECRET || "secret";

  return jwt.sign(data, secret, {
    expiresIn: 60 * timeInMinutes,
  });
};
