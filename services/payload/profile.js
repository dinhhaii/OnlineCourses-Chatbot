"use strict";

const Response = require("../response"),
  config = require("../config"), 
  i18n = require("../../i18n.config"),
  queryString = require('query-string'),
  { updateUser } = require('../api'),
  jwtExtension = require('jsonwebtoken'),
  { FEATURE, STATE, QUIT, MENU, PROFILE, CLIENT_URL, JWT_SECRET, updateProfileSteps } = require('../../utils/constant');

module.exports = class ProfileService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleConfirmUpdateUser(success, text, password) {
    this.user.setStep(0);
    this.user.resetUpdateData();
    this.user.setState(STATE.LOGED_IN);

    if (success) {
      let query = queryString.stringify(this.user.userData);

      return [
        Response.genText(text),
        Response.genButtonTemplate(i18n.__("update.access_page"), [
          Response.genWebUrlButton(i18n.__("feature.access_page"),`${CLIENT_URL}/auth/login?${query}`),
          Response.genPostbackButton(i18n.__("feature.change_password"), PROFILE.CHANGE_PASSWORD)
        ]),
      ];
    }
    return Response.genQuickReply(text, [ 
      Response.genPostbackButton(i18n.__("feature.forgot_password"), PROFILE.FORGOT_PASSWORD),
      Response.genPostbackButton(i18n.__("feature.change_password"), PROFILE.CHANGE_PASSWORD),
    ]);
  }

  async handlePayload(payload) {
    let response;

    const quitQuickReply = Response.genPostbackButton(i18n.__("fallback.quit"), QUIT);

    switch (payload) {
      case PROFILE.UPDATE:
        this.user.setState(STATE.UPDATE_USER);
        this.user.setStep(0);
        return Response.genQuickReply(i18n.__(updateProfileSteps[0].phrase), [ quitQuickReply ]);
      case PROFILE.UPDATE_CONFIRM_YES:
        const newUser = {
          ...this.user.updateUserData,
          _idUser: this.user.userData._id
        }

        const { data } = await updateUser(newUser);
        if (!data.error) {
          this.user.setUserData(data);
          return this.handleConfirmUpdateUser(true, i18n.__("update.success"));
        }
        return this.handleConfirmUpdateUser(false, i18n.__("update.failed", { error: data.error }));
      case PROFILE.UPDATE_CONFIRM_NO:
        return this.handleConfirmUpdateUser(false, i18n.__("update.cancel"));
      case PROFILE.CHANGE_PASSWORD:
        let loginData = { ...this.user.userData, token: jwtExtension.sign(JSON.stringify(this.user.userData), JWT_SECRET) };
        let query = queryString.stringify(loginData);
        query += "&previousPath=/profile?tab=change-password";
        if (!this.user.userData.idFacebook) {
          return Response.genQuickReply(i18n.__("update.change_password_failed"), [
            Response.genPostbackButton(i18n.__("feature.connect_facebook"), FEATURE.LOGIN)
          ]);
        }
        return Response.genButtonTemplate(i18n.__("update.change_password"), [
          Response.genWebUrlButton(i18n.__("feature.change_password"), `${CLIENT_URL}/auth/login?${query}`)
        ])
      default:
        return [];
    }

    return response;
  }
};
