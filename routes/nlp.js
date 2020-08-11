const router = require("express").Router(),
  NLP = require('../services/nlp'),
  aposToLexForm = require('apos-to-lex-form'),
  natural = require('natural'),
  SpellCorrector = require('spelling-corrector'),
  SW = require('stopword');

  const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
  const spellCorrector = new SpellCorrector();
  const tokenizer = new WordTokenizer();
  spellCorrector.loadDictionary();

router.get("/", async (req, res) => {
  NLP.trainData();
  res.send({ result: "Train data success" });
});

router.post("/sentiment-analysis", async (req, res) => {
  const { review } = req.body;

  const lexedReview = aposToLexForm(review).toLowerCase();
  const alphaReview = lexedReview.replace(/[^a-zA-Z\s]+/g, '');
  const tokens = tokenizer.tokenize(alphaReview);

  tokens.forEach((word, index) => {
    tokens[index] = spellCorrector.correct(word);
  })

  const removedStopwords = SW.removeStopwords(tokens);
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(removedStopwords);

  res.status(200).json({ analysis });
});

module.exports = router;
