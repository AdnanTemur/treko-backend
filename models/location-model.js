const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  latitudeDelta: { type: Number, required: true },
  longitudeDelta: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const LocationModel = mongoose.model("Location", locationSchema);

module.exports = LocationModel;
