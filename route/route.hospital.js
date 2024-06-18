const Hospital = require("../model/model.hospital");
const express = require("express");
const jwt = require("jsonwebtoken");
const withAuth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      location = {},
      address,
      telephone,
      type = [],
      description
    } = req.body;
    const hospital = new Hospital({
      email,
      password,
      name,
      location,
      address,
      telephone,
      type,
      description
    });
    const doc = await hospital.save();
    const payload = { email };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
    res.cookie("token", token).json({ token, hospital: doc });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering new hospital please try again.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(password);

  try {
    const hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }
    const same = await hospital.isCorrectPassword(password);
    if (!same) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }
    const payload = { email };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
    res.cookie("token", token).json({ token, hospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error please try again" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");
    res.json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.get("/protected", withAuth, (req, res) => {
  res.send({ message: "Auth Ok!" });
});

router.get("/profile/:id", async (req, res) => {
  try {
    const profile = await Hospital.findById(req.params.id);
    res.send({ data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

router.post("/profile/edit/:id", withAuth, async (req, res) => {
  try {
    const profile = await Hospital.findById(req.params.id);
    if (profile.email !== req.email) {
      return res.status(401).send({ message: "You are not authorized!" });
    }
    const updatedProfile = await Hospital.findByIdAndUpdate(req.params.id, req.body.updated, { new: true });
    res.send({ data: updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
