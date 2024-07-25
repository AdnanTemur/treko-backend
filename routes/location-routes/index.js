const express = require("express");
const LocationRouter = express.Router();
const { isAuthenticated } = require("../../middlewares/authenticated");
const {
  GetAllLocations,
  addLocation,
} = require("../../controllers/location-controller/locationController");

// Route to get all locations
LocationRouter.get("/get-all-locations", isAuthenticated, GetAllLocations);
LocationRouter.post("/create-location", isAuthenticated, addLocation);

module.exports = { LocationRouter };
