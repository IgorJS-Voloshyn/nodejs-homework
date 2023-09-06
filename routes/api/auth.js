const express = require("express");
const AuthController = require("../../controllers/auth");
const router = express.Router();
const auth = require("../../middleware/auth");

const jsonParser = express.json();
router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", auth, AuthController.logout);
router.get("/current", auth, AuthController.current);

module.exports = router;
