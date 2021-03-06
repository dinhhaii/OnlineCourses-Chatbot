"use strict";

const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  crypto = require("crypto"),
  path = require("path"),
  config = require("./services/config"),
  app = express(),
  nlpRouter = require('./routes/nlp'),
  emailRouter = require('./routes/email'),
  indexRouter = require('./routes/index'),
  logger = require('morgan'),
  constant = require('./utils/constant'),
  NLP = require('./services/nlp'),
  http = require('http'),
  cors = require('cors'),
  bodyParser = require('body-parser');

NLP.trainData();
const users = {};

// Parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: true
  })
);

// Parse application/json. Verify that callback came from Facebook
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors());
app.use(json({ verify: verifyRequestSignature }));
app.set("view engine", "ejs");

app.use('/', indexRouter);
app.use('/nlp', nlpRouter);
app.use('/email', emailRouter);


// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    console.log("Couldn't validate the signature.");
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

// Check if all environment variables are set
config.checkEnvVariables();

// Listen for requests
var listener = app.listen(config.port, function() {
  console.log("Your app is listening on port " + listener.address().port);

  if (Object.keys(config.personas).length == 0 && config.appUrl && config.verifyToken) {
    console.log(`CONFIG: ${config.appUrl}/profile?mode=all&verify_token=${config.verifyToken}`);
  }
  console.log(`NLP: ${config.appUrl}/nlp`)
  console.log("MESSENGER: https://m.me/" + config.pageId);
  console.log(`SERVER URL: ${constant.SERVER_URL}`);
  console.log(`CLIENT URL: ${constant.CLIENT_URL}`);
  console.log(`ADMIN URL: ${constant.ADMIN_URL}`);

});

module.exports = users;