"use strict";

const Response = require("../response"),
  config = require("../config"),
  i18n = require("../../i18n.config"),
  { FEATURE } = require('../../utils/constant');

module.exports = class ProfileService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case FEATURE.LOGIN: break;
      case FEATURE.LOGOUT: break;
      case FEATURE.SURVEY: break;
      case FEATURE.SCHEDULE: break;
      default: return [];
    }

    return response;
  }
};
