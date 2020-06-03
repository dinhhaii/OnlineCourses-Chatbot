var express = require("express");
var router = express.Router();
const { VERIFY_TOKEN, PAGE_ACCESS_TOKEN } = require("../utils/constant");
const { handleMessage, handlePostback } = require("../services/webhook");
const { FacebookProfileAPIClient, FacebookMessagingAPIClient, ValidateWebhook, FacebookMessageParser } = require('fb-messenger-bot-api');

router.get('/', (req, res) => {
  ValidateWebhook.validateServer(req, res, VERIFY_TOKEN);
});

router.post('/', async (req, res) => {
  const messagingClient = new FacebookMessagingAPIClient(process.env.PAGE_ACCESS_TOKEN || PAGE_ACCESS_TOKEN);
  const profileClient = new FacebookProfileAPIClient(process.env.PAGE_ACCESS_TOKEN);
  const incomingMessages = FacebookMessageParser.parsePayload(req.body);  
  try {

    const senderId = incomingMessages[0].sender.id;
    console.log(incomingMessages);
    // await messagingClient.markSeen(senderId);
    // await messagingClient.toggleTyping(senderId, true);
    // const result = await messagingClient.sendTextMessage(senderId, "Test");
    // console.log(`Message sent ${result}`);  
  
  res.status(200).send("EVENT_RECEIVED");
} catch(error) {
  console.log(error);
  res.status(500).send(error);
}
});


// router.get("/", (req, res) => {
//   let mode = req.query["hub.mode"];
//   let token = req.query["hub.verify_token"];
//   let challenge = req.query["hub.challenge"];

//   if (mode && token) {
//     if (mode === "subscribe" && token === VERIFY_TOKEN) {
//       console.log("WEBHOOK_VERIFIED");
//       res.status(200).send(challenge);
//     } else {
//       res.sendStatus(403);
//     }
//   }
// });

// router.post("/", (req, res) => {
//   let body = req.body;
//   try {
//       let messaging_events = body.entry[0].messaging;
//       for (let i = 0; i < messaging_events.length; i++) {
//         let event = req.body.entry[0].messaging[i];
//         let psid = event.sender.id;
//         let id = event.recipient.id;
//         if (event.message) {
//           handleMessage(psid, event.message);
//           handleMessage(id, event.message);
//         } else if (event.postback) {
//           handlePostback(psid, event.postback);
//         }
//       }

//       res.status(200).send("EVENT_RECEIVED");
//   } catch (e) {
//     console.log(e);
//     res.send(e.message);
//   }
// });

module.exports = router;
