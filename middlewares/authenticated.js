const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../enums");
const UserModel = require("../models/user-model");

const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "Access token is missing from headers" });
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid access token" });
      }
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { isAuthenticated };
