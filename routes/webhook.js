var express = require("express");
var router = express.Router();
const { VERIFY_TOKEN } = require("../utils/constant");
const services = require("../services/webhook");

router.get("/", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

router.post("/", (req, res) => {
  let body = req.body;
  try {
    if (body.object === "page") {
      body.entry.forEach(function (entry) {
        let event = entry.messaging[0];
        let sender_psid = event.sender.id;
        if (event.message) {
          console.log(event.message);
          services.handleMessage(sender_psid, event.message);
        } else {
          services.handlePostback(sender_psid, event.postback);
        }
      });

      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
});

module.exports = router;
