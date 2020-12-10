const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const axios = require("axios");
const User = require("../models/user");
const { createToken } = require("../utils/createToken");

exports.signUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: errors.array() });
  }

  const { login, password, type } = req.body;
  let hashedPw;
  let user;

  try {
    const checkResult = await User.findOne({ login });

    if (checkResult) {
      return res.status(422).json({ message: "User already exist!" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch {
    return res.status(500).json({ message: "Can't hash password" });
  }

  const userDoc = new User({
    login,
    password: hashedPw,
    id_type: type,
    tokens: [],
  });

  try {
    user = await userDoc.save();
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }

  const token = createToken({
    login: user.login,
    userId: user._id.toString(),
  });

  user.tokens.push(token);
  await user.save();

  return res.status(201).json({
    token,
  });
};

exports.signIn = async (req, res) => {
  const { login, password } = req.body;
  let user;

  try {
    user = await User.findOne({ login });

    if (!user) {
      return res.status(401).json({
        message: "User can't be found.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  try {
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({
        message: "Please try again.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  const token = createToken({
    login: user.login,
    userId: user._id.toString(),
  });

  user.tokens.push(token);
  await user.save();

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
    return res.status(500).json({ message: error.message });
  }

  return res.json({
    id: user.login,
    id_type: user.id_type,
  });
};

exports.logout = async (req, res) => {
  const { all } = req.query;
  const { userId, userToken } = req;
  let user;

  try {
    user = await User.findOne({ _id: userId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  if (all === "true") {
    user.tokens = [];
  }

  if (all === "false") {
    let tokens = [...user.tokens];
    tokens = tokens.filter((token) => token !== userToken);
    user.tokens = [...tokens];
  }

  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json({ message: "Logout successfully!" });
};

exports.latency = async (req, res) => {
  const beginAt = Date.now();

  const responseLatency = await axios
    .get("https://google.com")
    .then(() => Date.now() - beginAt)
    .catch((error) => res.status(500).json({ message: error.message }));

  res.status(200).json({ latency: `${responseLatency}ms` });
};
