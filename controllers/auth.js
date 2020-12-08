const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const createToken = (user, timeInMinutes) => {
  const secret = process.env.SECRET || "secret";

  return jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    secret,
    {
      expiresIn: 60 * timeInMinutes,
    }
  );
};

exports.signUp = async (req, res) => {
  const errors = validationResult(req);

  if (errors.array().length > 1) {
    return res.status(422).json({ message: errors.array() });
  }

  const { login, password } = req.body;
  const expirationTime = 10;
  let hashedPw;
  let user;

  try {
    const checkResult = await User.findOne({ login });

    if (checkResult) {
      return res.status(422).json({ message: "User already exist!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch {
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

  const token = createToken(user, expirationTime);

  return res.status(201).json({
    token,
  });
};

exports.signIn = async (req, res) => {
  const { login, password } = req.body;
  const expirationTime = 10;
  let user;

  try {
    user = await User.findOne({ login });

    if (!user) {
      return res.status(401).json({
        message: "User can't be found.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  try {
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({
        message: "Wrong password.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  const token = createToken(user, expirationTime);

  return res.status(200).json({
    token: `Bearer ${token}`,
  });
};

exports.getUserInfo = async (req, res) => {
  const { userId } = req;
  let user;

  try {
    user = await User.findOne({ _id: userId });
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  return res.json({
    id: user.login,
    id_type: user.id_type,
  });
};
