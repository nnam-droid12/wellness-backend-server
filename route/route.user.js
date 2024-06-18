const User = require("../model/model.user.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const withAuth = require("../middlewares/auth");

const router = express.Router();

router.post('/register', async function (req, res) {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
  
    try {
      const doc = await user.save(); 
      const payload = { email };
      const token = jwt.sign(payload, 'secret', {
        expiresIn: '1h',
      });
      res.cookie('token', token).json({ token, user: doc }); 
    } catch (err) {
      res.status(500).send({ message: err.message }); 
    }
  });
  

  router.post('/login', async function (req, res) {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      }
  
      const same = await user.isCorrectPassword(password);
  
      if (!same) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      }
  
      const payload = { email };
      const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });
  
      res.cookie('token', token).json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal error please try again' });
    }
  });
  
  

router.get("/protected", withAuth, function (req, res) {
  res.send({ message: "Auth Ok!" });
});

module.exports = router;
