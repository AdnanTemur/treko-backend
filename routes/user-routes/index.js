// routes/login.js
const express = require("express");

const UserRouter = express.Router();
const {
  RegisterUser,
  LoginUser,
  UpdateAccessToken,
  GetAllEmployees,
} = require("../../controllers/user-controller");
const { isAuthenticated } = require("../../middlewares/authenticated");

UserRouter.post("/register", RegisterUser);

UserRouter.post("/login", LoginUser);

UserRouter.get("/refresh-token", UpdateAccessToken);

UserRouter.get("/get-all-employees", isAuthenticated, GetAllEmployees);

module.exports = { UserRouter };
