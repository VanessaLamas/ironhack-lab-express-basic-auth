const express = require('express');
const router = express.Router();

// homepage render
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;

