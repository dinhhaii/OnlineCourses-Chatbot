const { NlpManager } = require("node-nlp"),
  vntk = require('vntk'),
  intentsEN = require("../utils/training-data"),
  intentsVN = require("../utils/training-data-vn");

const langid = require('vntk').langid();
class NLP {
  constructor(locale) {
    this.locale = locale;
  }
  
  static vnClassifier = new vntk.BayesClassifier();
  static enClassifier = new NlpManager({ languages: ["en"], nlu: { log: true } });

  static async trainData() {
    if (this.vnClassifier && this.enClassifier) {
          intentsVN.forEach((element) => {
            element.patterns.forEach((pattern) => {
              this.vnClassifier.addDocument(pattern, element.tag);
            });
          });
          intentsEN.forEach((element) => {
            element.patterns.forEach((pattern) => {
              this.enClassifier.addDocument("en", pattern, element.tag);
            });
            element.responses.forEach((response) => {
              this.enClassifier.addAnswer("en", element.tag, response);
            });
          });
      await this.vnClassifier.train();
      await this.enClassifier.train();
      this.enClassifier.save();
    }
  }

  static async detect(text) {
    return await langid.detect(text);
  }
  
  static async process(text, language) {
    if (language === 'vi') {
      const intent = await this.vnClassifier.classify(text);
      const { responses } = intentsVN.find(item => item.tag === intent);
      
      if (intent && responses) {
        const answers = responses.map(value => ({ answer: value }));
        return { intent, answers }
      }
      return { intent: 'None', answers: [] };
    }
    return await this.enClassifier.process(text);
    return intent;
  }
}

module.exports = NLP;
