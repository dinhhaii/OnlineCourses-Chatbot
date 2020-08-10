const router = require("express").Router(),
  Receive = require("../services/receive"),
  GraphAPi = require("../services/graph-api"),
  User = require("../services/user"),
  config = require("../services/config"),
  i18n = require("../i18n.config"),
  users = require('../app');

router.get("/", function(_req, res) {
  res.render("index");
});

// Adds support for GET requests to our webhook
router.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === config.verifyToken) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

router.post("/webhook", async (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    res.status(200).send("EVENT_RECEIVED");

    for(let entry of body.entry) {
      if ("changes" in entry) {
        let receiveMessage = new Receive();
        if (entry.changes[0].field === "feed") {
          let change = entry.changes[0].value;
          switch (change.item) {
            case "post":
              return receiveMessage.handlePrivateReply(
                "post_id",
                change.post_id
              );
              break;
            case "comment":
              return receiveMessage.handlePrivateReply(
                "commentgity _id",
                change.comment_id
              );
              break;
            default:
              console.log("Unsupported feed change type.");
              return;
          }
        }
      }

      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];

      if ("read" in webhookEvent) {
        // console.log("Got a read event");
        return;
      }

      if ("delivery" in webhookEvent) {
        // console.log("Got a delivery event");
        return;
      }

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;

      if (!(senderPsid in users)) {
        i18n.setLocale("en_EN");
        let user = new User(senderPsid);
        const result = await user.setProfile({ id: senderPsid });
        users[senderPsid] = result;
        let receiveMessage = new Receive(users[senderPsid], webhookEvent);
        return await receiveMessage.handleMessage();
      } else {
        i18n.setLocale(users[senderPsid].locale);
        let receiveMessage = new Receive(users[senderPsid], webhookEvent);
        return await receiveMessage.handleMessage();
      }
    };
  } else {
    res.sendStatus(404);
  }
});

// Set up your App's Messenger Profile
router.get("/profile", (req, res) => {
  let token = req.query["verify_token"];
  let mode = req.query["mode"];

  if (!config.webhookUrl.startsWith("https://")) {
    res.status(200).send("ERROR - Need a proper API_URL in the .env file");
  }
  var Profile = require("../services/profile.js");
  Profile = new Profile();

  if (mode && token) {
    if (token === config.verifyToken) {
      if (mode == "webhook" || mode == "all") {
        Profile.setWebhook();
        res.write(`<p>Set app ${config.appId} call to ${config.webhookUrl}</p>`);
      }
      if (mode == "profile" || mode == "all") {
        Profile.setThread();
        res.write(`<p>Set Messenger Profile of Page ${config.pageId}</p>`);
      }
      if (mode == "personas" || mode == "all") {
        Profile.setPersonas();
        res.write(`<p>Set Personas for ${config.appId}</p>`);
        res.write(
          "<p>To persist the personas, add the following variables \
            to your environment variables:</p>"
        );
        res.write("<ul>");
        res.write(`<li>PERSONA_TECHNICAL = ${config.personaTechnical.id}</li>`);
        res.write(`<li>PERSONA_CARE = ${config.personaCare.id}</li>`);
        res.write("</ul>");
      }
      if (mode == "nlp" || mode == "all") {
        GraphAPi.callNLPConfigsAPI();
        res.write(`<p>Enable Built-in NLP for Page ${config.pageId}</p>`);
      }
      if (mode == "domains" || mode == "all") {
        Profile.setWhitelistedDomains();
        res.write(`<p>Whitelisting domains: ${config.whitelistedDomains}</p>`);
      }
      if (mode == "private-reply") {
        Profile.setPageFeedWebhook();
        res.write(`<p>Set Page Feed Webhook for Private Replies.</p>`);
      }
      res.status(200).end();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
