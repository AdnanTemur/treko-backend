const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  EMPLOYEE,
} = require("../enums/index");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: EMPLOYEE,
    },
  },
  { timestamps: true }
);

// Sign In Access Token
Schema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, ACCESS_TOKEN_SECRET || " ", {
    expiresIn: "10m",
  });
};
Schema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, REFRESH_TOKEN_SECRET || " ", {
    expiresIn: "45m",
  });
};
const UserModel = mongoose.model("UserModel", Schema);
module.exports = UserModel;
