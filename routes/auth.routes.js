const express = require("express");
const router = express.Router();

// encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// encryption: bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

/* require only the model of user because 
we are validating in this document the 
session of the user */
const User = require("../models/User.model");

// require the middlewares of the session
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup and POST /auth/signup
router.get("/signup", (req, res) => {
  res.render("user/register");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  // all the fields of my account creation are obligatory
  if (username === "" || password === "") {
    res.status(400).render("user/register", {
      errorMessage:
        "All fields are mandatory.",
    });
    return;
  }
  if (password.length < 6) {
    res.status(400).render("user/register", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
    return;
  }
  // create a new user having the hashed password into account
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // create a user and save it in the database
      return User.create({ username, password: hashedPassword });
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error)
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("user/register", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("user/register", {
          errorMessage:
            "username needs to be unique.",
        });
      } else {
        next(error);
      }
    });
});



// GET /auth/login and POST /auth/login
router.get("/login",  (req, res) => {
  res.render("user/login");
});
router.post("/login",  (req, res, next) => {
  const { username, password } = req.body;
  // check that username and password are provided
  if (username === "" || password === "") {
    res.status(400).render("user/login", {
      errorMessage:
        "All fields are mandatory.",
    });
    return;
  }
  // here we use the same logic as in account creation for the password
  if (password.length < 6) {
    return res.status(400).render("user/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }
  // search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      /* if the user isn't found, send an error message that user 
      provided wrong credentials */
      if (!user) {
        res
          .status(400)
          .render("user/login", { errorMessage: "Ups... it seems we do not have you on our database. Please, create an account." });
        return;
      }
      /* If user is found based on the username, check if the in putted 
      password matches the one saved in the database */
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("user/login", { errorMessage: "Ups... it seems we do not have you on our database. Please, create an account." });
            return;
          }
          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;
          res.redirect("/");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// GET /auth/logout
// router.get("/logout", isLoggedIn, (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).render("user/logout", { errorMessage: err.message });
//       return;
//     }
//     res.redirect("/");
//   });
// });

module.exports = router;
