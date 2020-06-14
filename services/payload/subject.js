"use strict";

const Response = require("../response"),
  config = require("../config"),
  i18n = require("../../i18n.config"),
  api = require("../api"),
  { SUBJECT } = require('../../utils/constant');

module.exports = class SubjectService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  generateSubjectElement(item) {
    if (item) {
      const buttons = [
        Response.genWebUrlButton(i18n.__("subject.detail"), `${config.shopUrl}/courses?subject=${item.name}`)
      ];
      
      return Response.genGenericElementTemplate(
        item.name,
        `${item.courses.filter(e => !e.isDelete).length} courses`,
        item.imageURL,
        buttons,
        {
          type: "web_url",
          url: `${config.shopUrl}/courses?subject=${item.name}`,
          messenger_extensions: true,
          webview_height_ratio: "tall",
          fallback_url: `${config.shopUrl}/courses`,
        }
      );
    }
    return;
  };

  async fetchSubjects(search, offset, limit) {
    const { data } = await api.fetchSubjects(search, offset, limit);
    
    const quickReply = [
      {
        title: i18n.__("subject.all_subjects"),
        payload: SUBJECT.ALL_SUBJECTS,
      }
    ];

    if (!data.error) {
      const elements = data.map(item => {
        return this.generateSubjectElement(item);
      });
      
      if (data && data.length === 0) {
        return Response.genQuickReply(i18n.__("subject.prompt-none"), quickReply);
      } else {
        return [
          Response.genGenericTemplate(elements),
          Response.genQuickReply(i18n.__("subject.prompt"), quickReply)
        ];
      }
    } else {
      console.log(data.error);
      return [];
    }
  }

  async handlePayload(payload) {
    let message = this.webhookEvent.message.text.trim().toLowerCase();

    switch (payload) {
      case SUBJECT.ALL_SUBJECTS:
        return await this.fetchSubjects('', 0, 4);
      case SUBJECT.SUBJECTS: 
        return await this.fetchSubjects(message, 0, 4);
      default: return [];
    }
  }
};
