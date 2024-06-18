const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const withAuth = require("./middlewares/auth");
require("./db/mongoose");
const user = require("./route/route.user");
const hospital = require("./route/route.hospital");
const review = require("./route/route.review");
const booking = require("./route/route.booking");
const Hospital = require("./model/model.hospital");
const User = require("./model/model.user");
const Review = require("./model/model.review");
const dotenv = require('dotenv');

dotenv.config()

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));



app.use("/api/user", user);
app.use("/api/hospital", hospital);
app.use("/review", review);
app.use("/api/booking", booking);

app.get("/api/checkToken", withAuth, function(req, res) {
  const { email } = req;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again"
      });
    } else if (!user) {
      Hospital.findOne({ email }, (err, hospital) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: "Internal error please try again"
          });
        } else if (!hospital) {
          res.status(401).json({
            message: "Authenticate first"
          });
        } else if (hospital) {
          res.json({ hospital, isHospital: true });
        }
      });
    } else if (user) {
      res.json({ user, isHospital: false });
    }
  });
});

app.get("/api/", withAuth, function(req, res) {
  res.send("Welcome!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
