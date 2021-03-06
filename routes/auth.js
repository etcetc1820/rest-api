const express = require("express");
const authController = require("../controllers/auth");
const latencyController = require("../controllers/latency");
const isAuth = require("../middleware/isAuth");
const signUpValidation = require("../validations/signUpValidation");

const router = express.Router();

router.post("/signup", signUpValidation, authController.signUp);

router.post("/signin", authController.signIn);

router.get("/info", isAuth, authController.getUserInfo);

router.get("/logout", isAuth, authController.logout);

router.get("/latency", isAuth, latencyController.latency);

module.exports = router;
