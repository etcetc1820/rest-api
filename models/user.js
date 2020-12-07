const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  id_type: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
