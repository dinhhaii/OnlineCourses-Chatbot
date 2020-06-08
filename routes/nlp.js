const router = require("express").Router();
var natural = require('natural');

const test = "hourses courses vice president experences differences"

router.get("/", function(_req, res) {
  var tokenizer = new natural.WordTokenizer(); 
  var tokens = tokenizer.tokenize(test); 
  var nData = natural.PorterStemmer.stem(tokens); 
  console.log(nData); 
  res.send(nData);
});

module.exports = router;
