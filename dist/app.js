"use strict";

var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var cors = require("cors");
var _require = require("./routes/user-routes"),
  UserRouter = _require.UserRouter;
// const { QrRoutes } = require("./routes/QrCode");
// const { Builders } = require("./routes/builders-routes/Builders");
// const { StripeRoutes } = require("./routes/payment-routes/index");

// Middleware
app.use(express.json({
  verify: function verify(req, res, buffer) {
    return req["rawBody"] = buffer;
  }
}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(cors({
  origin: ["http://localhost:3000", "https://staffer-frontend.vercel.app", "*"]
}));
app.use(express.urlencoded({
  extended: false
}));

// Routes
app.use("/api/v1", UserRouter);

// Route for creating subscription

// Default route
app.get("/", function (req, res) {
  return res.status(200).send({
    message: "Great API working"
  });
});

// Catch-all route for 404 errors
app.all("*", function (req, res) {
  return res.status(404).send({
    message: req.originalUrl + " route not found"
  });
});
module.exports = {
  app: app
};