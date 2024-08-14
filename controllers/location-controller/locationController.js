const asyncHandler = require("express-async-handler");
const LocationModel = require("../../models/location-model");
const UserModel = require("../../models/user-model");

const addLocation = asyncHandler(async (req, res) => {
  try {
    const { userId, latitude, longitude, latitudeDelta, longitudeDelta } =
      req.body;
    if (
      !userId ||
      latitude === undefined ||
      longitude === undefined ||
      latitudeDelta === undefined ||
      longitudeDelta === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const location = await LocationModel.findOneAndUpdate(
      { userId },
      {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
        timestamp: Date.now(),
      },
      { new: true, upsert: true }
    );

    const user = await UserModel.findById(userId).select("email name avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.latitudeDelta = latitudeDelta;
      location.longitudeDelta = longitudeDelta;
      location.timestamp = Date.now();
      await location.save();
    } else {
      location = new LocationModel({
        userId,
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      });
      await location.save();
    }

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
    const formattedLocations = locations.map((location) => {
      // Check if userId exists and is populated
      const user = location.userId
        ? {
            name: location.userId.name,
            avatar: location.userId.avatar,
            email: location.userId.email,
            _id: location.userId._id,
          }
        : {
            name: "Unknown User",
            avatar: null,
            email: "unknown@example.com",
            _id: null,
          };

      return {
        _id: location._id,
        timestamp: location.timestamp,
        __v: location.__v,
        userDetail: user,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: location.latitudeDelta,
          longitudeDelta: location.longitudeDelta,
        },
      };
    });

    res.status(200).json({
      message: "Locations fetched successfully",
      locations: formattedLocations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { GetAllLocations, addLocation };
