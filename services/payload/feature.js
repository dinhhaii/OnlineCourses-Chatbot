"use strict";

const Response = require("../response"),
  config = require("../config"),
  i18n = require("../../i18n.config"),
  { FEATURE, STATE } = require('../../utils/constant');

module.exports = class FeatureService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  async handlePayload(payload) {
    let response;

    switch (payload) {
      case FEATURE.LOGIN:
        this.user.setState(STATE.CONNECT_FACEBOOK);
        response = Response.genText(i18n.__("email.input"));
        break;
      case FEATURE.LOGOUT:
        break;
      case FEATURE.SURVEY:
        break;
      case FEATURE.SCHEDULE:
        break;
      default:
        return [];
    }

    return response;
  }
};
