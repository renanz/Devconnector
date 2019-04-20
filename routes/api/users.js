const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load user model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users works" });
});

// @route   GET api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  const { name, email, password, avatar } = req.body;
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ email: "Email already exists" });
    else {
      const newAvatar = gravatar.url(email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name,
        email,
        password,
        avatar: newAvatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            })
            .catch(err => {
              console.log(err);
            });
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) return res.status(404).json({ email: "User email not found" });

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched

        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        // Sign Token
        JWT.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else return res.status(400).json({ password: "Password incorrect" });
    });
  });
});

module.exports = router;
