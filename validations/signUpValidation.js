const { body } = require("express-validator");
const validator = require("validator");

module.exports = [
  body("login")
    .custom((value, { req }) => {
      const isEmail = validator.isEmail(value);
      const isPhone = validator.isMobilePhone(value, "uk-UA");

      if (isEmail) {
        req.body.type = "email";
      }

      if (isPhone) {
        req.body.type = "phone";
      }

      return isEmail || isPhone;
    })
    .withMessage("Please enter correct data"),
  body("password").trim().isLength({ min: 5 }),
];
