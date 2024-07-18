const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { UserRouter } = require("./routes/user-routes");

// Middleware
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://staffer-frontend.vercel.app",
      "*",
    ],
  })
);
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1", UserRouter);

// Route for creating subscription

// Default route
app.get("/", (req, res) => {
  return res.status(200).send({ message: "Great API working" });
});

// Catch-all route for 404 errors
app.all("*", (req, res) => {
  return res
    .status(404)
    .send({ message: req.originalUrl + " route not found" });
});

module.exports = { app };
