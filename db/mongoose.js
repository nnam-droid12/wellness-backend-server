const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config()

const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url)
.then(() => console.log('db connected'))
.catch((err) => console.log(err));
