const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const pincodeModel = require("../models/pincodeModel");
const NodeGeocoder = require("node-geocoder");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const router = express.Router();
const app = express();
app.use(bodyParser.json());

const APP_HOST_ID = process.env.APPLICATION_HOST_ID;
const APP_PORT_ID = process.env.MONGO_PORT;

async function getReverseGeocodingData(lat, lng) {
    let options = {
        provider: "openstreetmap",
    };
    let geoCoder = NodeGeocoder(options);
    let response = await geoCoder.reverse({ lat: lat, lon: lng });
    return response[0]?.zipcode;
}

router.get("/", async (req, res) => {
    console.log("request", req.body);

    const url = `mongodb://127.0.0.1:27017`;
    let pinCode = await getReverseGeocodingData(req.body.latitude, req.body.longitude);
    console.log(parseInt(pinCode));
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
                const db = client.db("database2");
                const pincodes = db.collection("pincodes");
                pincodes.findOne({ pincode: parseInt(pinCode) }, (err, result) => {
                    if (err || !result?.pincode) {
                        res.status(404).json({ message: "user is out of service area" });
                    } else {
                        res.status(200).json({ message: "The user is inside the region", pincode: result?.pincode?.toString() });
                    }
                });
                // pincodes.find({ pincode: 587155 }).toArray((err, result) => {
                //     if (err) {
                //         res.json({ message: "user is out of service area" });
                //     } else {
                //         res.json({ message: "The user is inside the list of latlongs", result: result.map((res) => res.pincode) });
                //     }
                // });
                console.log(`MongoDB Connected: ${url}`);
            }
        }
    );

    //     let pinCode = await getReverseGeocodingData(req.body.latitude, req.body.longitude);
    //     console.log(pinCode);
    //     try {

    //         pincodeModel.findOne({ pincode: pinCode }, (err, result) => {
    //             console.log(err);
    //             console.log(result);
    //             res.json({ message: result });
    //         });
    //     } catch (e) {
    //         console.log({ messsage: "Out of region", error: e });
    //     }
});

module.exports = router;
