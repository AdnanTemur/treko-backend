// routes/login.js
const express = require("express");

const UserRouter = express.Router();
const {
  RegisterUser,
  LoginUser,
  UpdateAccessToken,
  Test,
} = require("../../controllers/user-controller");
const { isAuthenticated } = require("../../middlewares/authenticated");

UserRouter.post("/register", RegisterUser);

UserRouter.post("/login", LoginUser);

UserRouter.get("/refresh-token", UpdateAccessToken);

UserRouter.post("/test", isAuthenticated, Test);

module.exports = { UserRouter };
