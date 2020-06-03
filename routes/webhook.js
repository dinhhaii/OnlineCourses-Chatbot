var express = require("express");
var router = express.Router();
const { VERIFY_TOKEN } = require("../utils/constant");
const { handleMessage, handlePostback } = require("../services/webhook");

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
      let messaging_events = body.entry[0].messaging;
      for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i];
        let psid = event.sender.id;
        if (event.message) {
          handleMessage(psid, event.message);
        } else if (event.postback) {
          handlePostback(psid, event.postback);
        }
      }

      res.status(200).send("EVENT_RECEIVED");
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
});

module.exports = router;
