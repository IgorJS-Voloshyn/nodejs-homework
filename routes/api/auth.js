const express = require("express");
const AuthController = require("../../controllers/auth");
const router = express.Router();
const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");
const validateBody = require("../../middleware/validateBody.js");

const jsonParser = express.json();
router.post(
  "/register",
  jsonParser,
  validateBody(userSchema),
  AuthController.register
);
router.post(
  "/login",
  jsonParser,
  validateBody(userSchema),
  AuthController.login
);
router.post("/logout", auth, validateBody(userSchema), AuthController.logout);
router.get("/current", auth, AuthController.current);

module.exports = router;
