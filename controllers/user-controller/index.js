const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/user-model.js");
const jwt = require("jsonwebtoken");
const { handleErrorResponse } = require("../../utils/errorhandler.js");
const { CREATED, BAD_REQUEST } = require("../../utils/status.js");
const {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  EMPLOYEE,
} = require("../../enums/index.js");
const {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} = require("../../utils/tokens.js");
const { cloudinary } = require("../../utils/cloudinary.js");
const { default: mongoose } = require("mongoose");

// Register User
const RegisterUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const avatar = req.file;

    if (!name || !password || !email || !confirmPassword) {
      return res.status(400).send({
        message: "Please enter name, password, email, and confirm password",
      });
    }

    // Validate the email format
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ message: "Password and confirm password do not match" });
    }

    const isEmailExist = await UserModel.findOne({ email: email });
    if (isEmailExist) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Upload avatar to Cloudinary
    let avatarUrl = null;
    if (avatar) {
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
              transformation: [{ width: 500, height: 500, crop: "limit" }],
            },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                avatarUrl = result.secure_url;
                resolve();
              }
            }
          );
          uploadStream.end(avatar.buffer);
        });
      } catch (uploadError) {
        return res.status(500).send({
          message: "Failed to upload avatar",
          error: uploadError.message,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword, avatar: avatarUrl };
    const newUser = await UserModel.create(user);
    const sendUser = { name, email, avatar: avatarUrl };

    if (newUser) {
      return res.status(201).send({
        message: "User has been created successfully",
        user: sendUser,
      });
    } else {
      return res.status(500).send({
        message: "Failed to create user",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
});

// Login Users
const LoginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Password is valid, send token
    sendToken(user, 200, res);
  } catch (error) {
    // Handle any unexpected errors
    return handleErrorResponse(res, error);
  }
});
// update accesstoken
const UpdateAccessToken = asyncHandler(async (req, res) => {
  try {
    const refresh_token = req.headers["x-refresh-token"];
    if (!refresh_token) {
      return res
        .status(401)
        .json({ message: "Refresh token is missing from headers" });
    }

    const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Could not refresh token" });
    }
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Could not refresh token" });
    }

    const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "24h",
    });

    req.user = user;
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // Customize the error handling based on the specific errors you want to handle
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Refresh token has expired. Please login again." });
    }
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const GetAllEmployees = asyncHandler(async (req, res) => {
  try {
    const employees = await UserModel.find({ role: EMPLOYEE });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    return res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
// Get User by ID
const GetUserById = asyncHandler(async (req, res) => {
  try {
    console.log("Request Params:", req.params); // Log the parameters
    const { userId } = req.params; // Extract userId directly

    // Validate ID format (optional, but generally good practice)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await UserModel.findById(userId).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user); // Return user object directly
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = {
  RegisterUser,
  LoginUser,
  UpdateAccessToken,
  GetAllEmployees,
  GetUserById,
};
