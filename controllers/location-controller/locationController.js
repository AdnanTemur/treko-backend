const asyncHandler = require("express-async-handler");
const LocationModel = require("../../models/location-model");
const UserModel = require("../../models/user-model");

function initializeLocations(io) {
  io.on("connection", (socket) => {
    console.log(" 📍 A user location connected 📍", socket.id);

    socket.on("updateLocation", async ({ userId, latitude, longitude }) => {
      try {
        const existingLocation = await LocationModel.findOne({ userId });
        if (existingLocation) {
          existingLocation.latitude = latitude;
          existingLocation.longitude = longitude;
          existingLocation.timestamp = new Date();
          await existingLocation.save();
        } else {
          await LocationModel.create({
            userId,
            latitude,
            longitude,
            timestamp: new Date(),
          });
        }
        io.emit("locationUpdate", { userId, latitude, longitude });
      } catch (error) {
        console.error("Error handling location update: ", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("📍 User disconnected 📍", socket.id);
    });
  });
}

const addLocation = asyncHandler(async (req, res) => {
  try {
    const { userId, latitude, longitude, latitudeDelta, longitudeDelta } =
      req.body;

    // Validate request body
    if (
      !userId ||
      latitude === undefined ||
      longitude === undefined ||
      latitudeDelta === undefined ||
      longitudeDelta === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find existing location entry for the user
    let location = await LocationModel.findOne({ userId });

    if (location) {
      // Update existing location
      location.latitude = latitude;
      location.longitude = longitude;
      location.latitudeDelta = latitudeDelta;
      location.longitudeDelta = longitudeDelta;
      location.timestamp = Date.now(); // Update the timestamp to the current time
      await location.save();
    } else {
      // Create new location entry
      location = new LocationModel({
        userId,
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      });
      await location.save();
    }

    // Fetch user details
    const user = await UserModel.findById(userId).select("email name avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the response

    res.status(200).json({
      message: location
        ? "Location updated successfully"
        : "Location added successfully",
      data: location,
    });
  } catch (error) {
    console.error("Error adding location", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const GetAllLocations = asyncHandler(async (req, res) => {
  try {
    // Fetch all location entries from the database
    const locations = await LocationModel.find()
      .populate({
        path: "userId", // Populate the 'userId' field
        select: "name email avatar", // Include 'name', 'email', and 'avatar' fields from the User model
      })
      .sort({ timestamp: -1 }); // Sort by the most recent location

    // Format the response
    const formattedLocations = locations.map((location) => ({
      _id: location._id,
      timestamp: location.timestamp,
      __v: location.__v,
      userDetail: {
        name: location.userId.name,
        avatar: location.userId.avatar,
        email: location.userId.email,
        _id: location.userId._id,
      },
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: location.latitudeDelta,
        longitudeDelta: location.longitudeDelta,
      },
    }));

    res.status(200).json({
      message: "Locations fetched successfully",
      locations: formattedLocations,
    });
  } catch (error) {
    console.error("Error fetching locations", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { initializeLocations, GetAllLocations, addLocation };
