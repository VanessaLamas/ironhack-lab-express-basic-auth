// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const hbs = require("hbs");
const express = require('express');
const app = express();

// Handles the handlebars
// https://www.npmjs.com/package/hbs


// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);


// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// Set a user variable on res.locals
// app.use(function(req, res, next) {
//   if (req.session.currentUser) {
//     res.locals.user = req.session.currentUser;
//   }
//   next();
// }); 

// 👇 Start handling routes here
const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

