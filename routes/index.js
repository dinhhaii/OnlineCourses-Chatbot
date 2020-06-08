const router = require("express").Router(),
  Receive = require("../services/receive"),
  GraphAPi = require("../services/graph-api"),
  User = require("../services/user"),
  config = require("../services/config"),
  i18n = require("../i18n.config");

var users = {};

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

router.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    res.status(200).send("EVENT_RECEIVED");

    body.entry.forEach(function(entry) {
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

      // Discard uninteresting events
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
        let user = new User(senderPsid);

        GraphAPi.getUserProfile(senderPsid)
          .then((userProfile) => {
            console.log(userProfile);
            user.setProfile(userProfile);
          })
          .catch((error) => {
            console.log("Profile is unavailable:", error);
          })
          .finally(() => {
            users[senderPsid] = user;
            // i18n.setLocale(user.locale);
            let receiveMessage = new Receive(users[senderPsid], webhookEvent);
            return receiveMessage.handleMessage();
          });
      } else {
        // i18n.setLocale(users[senderPsid].locale);
        let receiveMessage = new Receive(users[senderPsid], webhookEvent);
        return receiveMessage.handleMessage();
      }
    });
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
        res.write(
          `<p>Set app ${config.appId} call to ${config.webhookUrl}</p>`
        );
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
        res.write(`<li>PERSONA_BILLING = ${config.personaBilling.id}</li>`);
        res.write(`<li>PERSONA_CARE = ${config.personaCare.id}</li>`);
        res.write(`<li>PERSONA_ORDER = ${config.personaOrder.id}</li>`);
        res.write(`<li>PERSONA_SALES = ${config.personaSales.id}</li>`);
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
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    // Returns a '404 Not Found' if mode or token are missing
    res.sendStatus(404);
  }
});

module.exports = router;