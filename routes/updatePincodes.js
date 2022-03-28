const express = require("express");
const router = express.Router();
const pinCode = require("../models/pincodeModel");

router.get("/", (req, res) => {
    res.send("On Posts");
});

module.exports = router;
