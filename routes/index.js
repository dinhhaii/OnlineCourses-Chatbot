var express = require('express');
var router = express.Router();
const constant = require('../utils/constant');

router.get("/", (req, res) => {
  res.send('<a href="https://cafocc.web.app">Client</a>');
});

module.exports = router;
