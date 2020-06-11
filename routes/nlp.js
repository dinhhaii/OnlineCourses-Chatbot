const router = require("express").Router(),
  NLP = require('../services/nlp');

router.get("/", async (req, res) => {
  NLP.trainData();
  res.send({ result: "Train data success" });
});

module.exports = router;
