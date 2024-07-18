"use strict";

// routes/login.js
var express = require("express");
var UserRouter = express.Router();
var _require = require("../../controllers/user-controller"),
  RegisterUser = _require.RegisterUser,
  LoginUser = _require.LoginUser,
  UpdateAccessToken = _require.UpdateAccessToken,
  Test = _require.Test;
var _require2 = require("../../middlewares/authenticated"),
  isAuthenticated = _require2.isAuthenticated;
UserRouter.post("/register", RegisterUser);
UserRouter.post("/login", LoginUser);
UserRouter.get("/refresh-token", UpdateAccessToken);
UserRouter.post("/test", isAuthenticated, Test);
module.exports = {
  UserRouter: UserRouter
};