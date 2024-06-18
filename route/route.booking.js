const Booking = require("../model/model.booking");
const express = require("express");

const router = express.Router();

router.post("/new", async (req, res) => {
    const { bookingTime, hospitalID, userID, userName, remark, bookingDate } = req.body;
    
    try {
      const booking = new Booking({
        bookingTime,
        hospitalID,
        userID,
        userName,
        remark,
        bookingDate
      });
  
      const savedBooking = await booking.save();
      res.send(savedBooking);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error registering new booking. Please try again.");
    }
  });
  

  router.post("/update", async (req, res) => {
    const { id, status } = req.body;
  
    try {
      const booking = await Booking.findOne({ _id: id });
      if (!booking) {
        res.status(404).send({ message: "Booking not found" });
        return;
      }
  
      booking.status = status;
      await booking.save();
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating booking. Please try again.");
    }
  });
  

  router.post("/all", async (req, res) => {
    const { hospitalID } = req.body;
  
    try {
      const bookings = await Booking.find({ hospitalID });
      res.send({ bookings });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching bookings. Please try again.");
    }
  });
  

module.exports = router;
