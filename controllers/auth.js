const User = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const usersSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required(),
});

async function register(req, res, next) {
  const { error, value } = usersSchema.validate(req.body);
  const { password, email } = value;
  if (typeof error !== "undefined") {
    return res.status(400).json(error.details[0].message);
  }
  try {
    const user = await User.findOne({ email }).exec();
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passHash = await bcrypt.hash(password, 10);
    await User.create({ email, password: passHash });
    res.status(201).send({
      user: {
        email: email,
        subscription: "starter",
      },
    });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function login(req, res, next) {
  const { error, value } = usersSchema.validate(req.body);
  const { password, email } = value;
  if (typeof error !== "undefined") {
    return res.status(400).json(error.details[0].message);
  }
  try {
    const user = await User.findOne({ email }).exec();
    if (user === null) {
      console.log(email);
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch !== true) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT,
      { expiresIn: "1d" }
    );

    await User.findByIdAndUpdate(user._id, { token }).exec();
    res.status(201).send({
      token,
      user: {
        email: "example@example.com",
        subscription: "starter",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null }).exec();
    res.status(204).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
}

function current(req, res, next) {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
}

module.exports = { register, login, logout, current };
