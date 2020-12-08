const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signUp = async (req, res) => {
  const errors = validationResult(req);

  if (errors.array().length > 1) {
    return res.status(422).json({ message: errors.array() });
  }

  const { login, password } = req.body;
  const expirationTime = 10; // minutes
  let hashedPw;
  let user;

  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch (error) {
    return res.status(500).json({ message: "Can't hash password" });
  }

  const userDoc = new User({
    login,
    password: hashedPw,
    id_type: errors.array()[0].param === "email" ? "phone" : "email",
  });

  try {
    user = await userDoc.save();
  } catch (error) {
    return res.status(422).json({ message: error });
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    "supersecretprivatekey",
    {
      expiresIn: 60 * expirationTime,
    }
  );

  return res.status(201).json({
    token,
  });
};
