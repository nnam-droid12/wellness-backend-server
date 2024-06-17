const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config()

const mongo_url = process.env.MONGO_URL;
mongoose.connect(
    mongo_url,
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDB Connected");
    }
  }
);
