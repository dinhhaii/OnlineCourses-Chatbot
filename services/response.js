"use strict";

const i18n = require("../i18n.config"),
  { MENU, FEATURE, STATE } = require('../utils/constant');

module.exports = class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: [],
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"],
      });
    }

    return response;
  }

  static genReceiptElementTemplate(title, subtitle, quantity, price, image_url) {
    return { title, subtitle, quantity, price, image_url, currency: "USD"};
  }

  static genReceiptSummary(subtotal, total_cost, shipping_cost, total_tax) {
    return { subtotal, shipping_cost, total_tax, total_cost };
  }

  static genReceiptTemplate(recipient_name, order_number, summary, elements, adjustments) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name,
          order_number,
          currency: "USD",
          payment_method: "Visa/MasterCard",
          summary,
          elements,
          adjustments
        },
      },
    };

    return response;
  }

  static genListElementTemplate(title, subtitle, image_url, buttons, default_action) {
    return { title, subtitle, image_url, buttons, default_action }
  }

  static genGenericElementTemplate(title, subtitle, image_url, buttons, default_action) {
    return { title, subtitle, image_url, buttons, default_action }
  }

  static genListTemplate(elements, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "list",
          top_element_style: "compact",
          elements: elements,
          buttons: buttons
        },
      },
    };

    return response;
  }

  static genGenericTemplate(elements) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          image_aspect_ratio: "square",
          elements: elements
        },
      },
    };

    return response;
  }

  static genImageTemplate(url) {
    let response = {
      attachment: {
        type: "image",
        payload: {
          is_reusable: true,
          url
        },
      },
    };
    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons,
        },
      },
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text,
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id,
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title,
      payload,
    };

    return response;
  }

  static genWebUrlButton(title, url, messenger_extensions) {
    let response = {
      type: "web_url",
      title,
      url,
      messenger_extensions
    };

    return response;
  }

  static genGetStartedMessage(user) {
    const buttons = [
      this.genPostbackButton(i18n.__("menu.website"), MENU.WEBSITE),
      this.genPostbackButton(i18n.__("menu.features"), MENU.FEATURES),
      this.genPostbackButton(i18n.__("menu.corona"), FEATURE.COVID19),
    ];

    const elements = [
      this.genGenericElementTemplate(
        i18n.__("get_started.welcome", { firstName: user.firstName }),
        i18n.__("get_started.help"),
        "https://www.easywallprints.com/upload/designs/wordcloud-illustration-of-education-zoom-1.jpg",
        buttons
      )
    ];

    const quickReply = this.genQuickReply('', [ this.genPostbackButton(i18n.__("feature.quick_login"), FEATURE.LOGIN )])
    return user.state === STATE.LOGED_IN ? [ this.genGenericTemplate(elements), quickReply ] : this.genGenericTemplate(elements);
  }

  static genByeMessage(user) {
    const responses = [
      "Goodbye! Thank you for trusting Hacademy!",
      "Bye! Look forward to seeing you again!",
      "It was very lovely to have you on our site, bye bye!!",
      "Goodbye! Hacademy looks forward to our next conversation!",
      "Hasta Lavista my friend! Hope you've had a great time using Hacademy!"
    ];
    return this.genText(responses[Math.floor(Math.random() * responses.length)]);
  }
};
