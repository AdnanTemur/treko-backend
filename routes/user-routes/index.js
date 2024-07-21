// routes/login.js
const express = require("express");

const UserRouter = express.Router();
const {
  RegisterUser,
  LoginUser,
  UpdateAccessToken,
  GetAllEmployees,
  GetUserById,
} = require("../../controllers/user-controller");
const { isAuthenticated } = require("../../middlewares/authenticated");

const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

UserRouter.post("/register", upload.single("avatar"), RegisterUser);

UserRouter.post("/login", LoginUser);

UserRouter.get("/refresh-token", UpdateAccessToken);

UserRouter.get("/get-all-employees", isAuthenticated, GetAllEmployees);

UserRouter.get("/get-user/:userId", isAuthenticated, GetUserById);

module.exports = { UserRouter };
