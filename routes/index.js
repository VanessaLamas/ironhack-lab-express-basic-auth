const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// homepage render
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req,res,next) => {
  res.render('main');
})

module.exports = router;

