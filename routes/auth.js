const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("login")
      .trim()
      .if((value, { req }) => {
        req.body.email = value;
        req.body.phone = value;
      }),
    body("email").isEmail().normalizeEmail(),
    body("phone").isMobilePhone("uk-UA"),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signUp
);

module.exports = router;
