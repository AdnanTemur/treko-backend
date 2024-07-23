const asyncHandler = require("express-async-handler");

const Testing = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json({ message: "nice" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  Testing,
};
