const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");
// Load User model
const User = require("../../models/User");

// @route   GET api/profiles/test
// @desc    Test profiles route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profiles works" });
});

// @route   GET api/profile
// @desc    Get current users profile
// @access  Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    const {
      handle,
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      linkedin,
      facebook,
      instagram,
      twitter
    } = req.body;

    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - split into array
    if (typeof skills !== "undefined") profileFields.skills = skills.split(",");
    // Socials
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
        });

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

module.exports = router;
