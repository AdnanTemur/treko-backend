// routes/login.js
const express = require("express");
const UserRouter = express.Router();
const {
  RegisterUser,
  LoginUser,
  UpdateAccessToken,
  GetAllUsers,
  GetUserById,
  GetAllEmployees,
  UpdateUserProfile,
} = require("../../controllers/user-controller");
const { isAuthenticated } = require("../../middlewares/authenticated");
const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

UserRouter.post("/register", upload.single("avatar"), RegisterUser);

UserRouter.post("/login", LoginUser);

UserRouter.get("/refresh-token", UpdateAccessToken);

UserRouter.get("/get-all-users", isAuthenticated, GetAllUsers);

UserRouter.get("/get-all-employees", isAuthenticated, GetAllEmployees);

UserRouter.get("/get-user/:employeeId", isAuthenticated, GetUserById);

UserRouter.post(
  "/update-user/:employeeId",
  upload.single("avatar"),
  isAuthenticated,
  UpdateUserProfile
);

module.exports = { UserRouter };
