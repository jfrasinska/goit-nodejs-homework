const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const User = require("../../models/userModel");
const saltRounds = 10;

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const avatarURL = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "identicon",
    });

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });

    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
