const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { UserRouter } = require("./routes/user-routes");
const {
  initializeChatSocket,
} = require("./controllers/chat-controller/chatSocketHandler");
const { ChatRouter } = require("./routes/chat-routes");
const { LocationRouter } = require("./routes/location-routes");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Adjust according to your security requirements
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

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
    origin: "*", // This should be adjusted for production
  })
);
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/", UserRouter);
app.use("/api/v1/", ChatRouter);
app.use("/api/v1/", LocationRouter);


// Initialize chat sockets and locations
initializeChatSocket(io);

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

module.exports = { app, server };
