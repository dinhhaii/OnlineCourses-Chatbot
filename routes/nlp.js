const router = require("express").Router(),
  NLP = require('../services/nlp'),
  crypto = require("crypto");

router.get("/", async (req, res) => {
  NLP.trainData();
  res.send({ result: "Train data success" });
  // res.send(crypto.createHmac("sha256",process.env.PAGE_ACCESS_TOKEN).digest("hex"));
});

module.exports = router;
