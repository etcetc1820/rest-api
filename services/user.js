const User = require("../models/user");

exports.findUser = (findBy) => {
  return User.findOne(findBy);
};

exports.createUser = (user) => {
  const userDoc = new User(user);

  return userDoc.save();
};
