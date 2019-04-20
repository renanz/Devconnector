const express = require("express");
const router = express.Router();

// @route   GET api/profiles/test
// @desc    Test profiles route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Profiles works" });
});

module.exports = router;
