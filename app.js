const express = require("express");
// const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const findPinCodeRoute = require("./routes/findPinCode");

const app = express();
dotenv.config();

const APP_HOST_ID = process.env.APPLICATION_HOST_ID;
const APP_PORT_ID = process.env.MONGO_PORT;

// Import routes

// Use middlewares
app.use(bodyParser.json());
app.use("/find-pincode", findPinCodeRoute);

// ROUTES
app.get("/", (req, res) => res.send("Home"));

// Connect to the Database
const url = `mongodb://${APP_HOST_ID}:${APP_PORT_ID}`;
MongoClient.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(`MongoDB Connected: ${url}`);
        }
    }
);
// mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
//     console.log("Connected to DB");
// });

// Listening to the server
app.listen(3000);
