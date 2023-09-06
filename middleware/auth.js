const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  const [bearer, token] = authHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({
      message: "Not authorized",
    });
  }

  jwt.verify(token, process.env.JWT, async (err, decode) => {
    if (err) {
      return next(err);
    }

    try {
      const user = await User.findById(decode.id).exec();

      if (user.token !== token) {
        return res.status(401).send({
          message: "Not authorized",
        });
      }
      req.user = { id: decode.id };
      next();
    } catch (err) {
      next(err);
    }
  });
}

module.exports = auth;
