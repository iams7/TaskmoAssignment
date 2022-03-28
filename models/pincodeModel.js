const mongoose = require("mongoose");

const PinCodeSchema = mongoose.Schema({
    scores: String,
});

module.exports = mongoose.model("Pincodes", PinCodeSchema);
