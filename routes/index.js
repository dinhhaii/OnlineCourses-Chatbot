var express = require('express');
var router = express.Router();
const constant = require('../utils/constant');

router.get("/", (req, res) => {
  res.send(`<a href=${constant.URL_CLIENT}>${constant.URL_CLIENT}</a>`);
});

module.exports = router;
