const natural = require("natural"),
  { NlpManager } = require("node-nlp"),
  intents = require("../utils/training-data");

class NLP {
  static classifier = new NlpManager({ languages: ["en"], nlu: { log: true } });

  static getClassifier() {
    return classifier;
  }

  static async trainData() {
    intents.forEach((element) => {
      element.patterns.forEach((pattern) => {
        this.classifier.addDocument("en", pattern, element.tag);
      });
      element.responses.forEach((response) => {
        this.classifier.addAnswer("en", element.tag, response);
      });
    });

    await this.classifier.train();
    this.classifier.save();
  }

  static async process(text) {
    return await this.classifier.process(text);
  }
}

module.exports = NLP;
