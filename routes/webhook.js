var express = require('express');
var router = express.Router();
const constant = require('../utils/constant');

router.get("/", (req, res) => {
  res.send('Hello Hai');
});

module.exports = router;
