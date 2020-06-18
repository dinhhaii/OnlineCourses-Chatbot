const router = require("express").Router(),
  Response = require("../services/response"),
  GraphAPi = require("../services/graph-api"),
  request = require("request"),
  i18n = require("../i18n.config"),
  nodemailer = require("nodemailer"),
  { updateUser } = require("../services/api"),
  { USERNAME_EMAIL, PASSWORD_EMAIL, STATE } = require("../utils/constant"),
  users = require("../app");

router.get("/send", function(req, res) {
  const { email, idFacebook } = req.query;
  const url = `${req.protocol}://${req.get("host")}/email/confirm?email=${email}&idFacebook=${idFacebook}`;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USERNAME_EMAIL || USERNAME_EMAIL,
      pass: process.env.PASSWORD_EMAIL || PASSWORD_EMAIL,
    },
  });

  var mailOptions = {
    from: USERNAME_EMAIL,
    to: email,
    subject: "[Hacademy] - CONNECT TO FACEBOOK ACCOUNT",
    html: `Please click the link to connect your facebook account: <a href="${url}">${url}</a>
          <p>The link will be expired in 24h.</p>`,
    expire: "1d",
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.json({ error: error.message });
    } else {
      console.log("Email sent: " + info.response);
      res.json({
        message:
          "Email was sent! Please open the verification link in your email! (Check Spam section if you can't find it)",
      });
    }
  });
});

router.get("/confirm", async (req, res) => {
  const { email, idFacebook } = req.query;
  try {
    if (Object.keys(users).includes(idFacebook.toString())) {
      const updatedData = {
        idFacebook: idFacebook.toString(),
        _id: users[idFacebook].updateUserData._id
      }
      updateUser(updatedData).then(({data}) => {
        if (!data.error) {
          users[idFacebook].setUserData(data);
          users[idFacebook].setState(STATE.LOGED_IN);
          users[idFacebook].resetUpdateData();
          
          const requestBody = {
            recipient: {
              id: idFacebook,
            },
            message: Response.genText(i18n.__("email.connected", { email })),
          };
          GraphAPi.callSendAPI(requestBody);
          res.send("Connected successfully");
        } else {
          res.json({ error: data.error })
        }
      })
    } else {
      res.json({ error: "User not found." });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
