var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

const test = "Hello, Can you give me some advice about the course?"
natural.PorterStemmer.stem();
console.log(test.tokenizeAndStem());
