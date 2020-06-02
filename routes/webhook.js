var express = require('express');
var router = express.Router();
const constant = require('../utils/constant');

router.get("/", (req, res) => {
  if (req.query['hub.verify_token'] === "hacademy-chatbot") {
      res.send(req.query['hub.challenge']);
  }
  res.send("Wrong token");
});

module.exports = router;
