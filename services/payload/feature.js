"use strict";

const Response = require("../response"),
  config = require("../config"), 
  { createUser } = require('../api'),
  i18n = require("../../i18n.config"),
  { FEATURE, STATE, registerSteps, QUIT, MENU, PROFILE } = require('../../utils/constant');

module.exports = class FeatureService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleConfirmCreateUser(success, text) {
    this.user.setStep(0);
    this.user.resetUpdateData();
    if (success) {
      this.user.setState(this.user.userData.idFacebook ? STATE.LOGED_IN : STATE.NONE);
      return Response.genQuickReply(text, [ 
        Response.genPostbackButton(i18n.__("feature.change_password"), `${config.appUrl}`) 
      ]);
    } 
    return Response.genQuickReply(text, [ 
      Response.genPostbackButton(i18n.__("feature.register"), FEATURE.REGISTER),
      Response.genPostbackButton(i18n.__("feature.login"), FEATURE.LOGIN),
    ]);
  }

  handleChooseRole(role) {
    this.user.setUpdateData({ role });
    this.user.setStep(this.user.step + 1);
    return [
      Response.genText(i18n.__(registerSteps[this.user.step].phrase, { ...this.user.updateUserData })),
      Response.genQuickReply(i18n.__("register.confirm"), [ 
        Response.genPostbackButton(i18n.__("confirm.yes"), FEATURE.REGISTER_CONFIRM_YES),
        Response.genPostbackButton(i18n.__("confirm.no"), FEATURE.REGISTER_CONFIRM_NO),
        Response.genPostbackButton(i18n.__("fallback.quit"), QUIT)
      ])
    ]
  }

  async handlePayload(payload) {
    let response;

    const quitQuickReply = {
      title: i18n.__("fallback.quit"),
      payload: QUIT
    };

    switch (payload) {
      case MENU.FEATURES:
        const buttons = this.user.userData._id
          ? [
              Response.genPostbackButton(i18n.__("feature.login"), FEATURE.LOGIN),
              Response.genPostbackButton(i18n.__("feature.register"),FEATURE.REGISTER),
              Response.genPostbackButton(i18n.__("feature.survey"),FEATURE.SURVEY),
            ]
          : [ 
              Response.genPostbackButton(i18n.__("feature.update_profile"),PROFILE.UPDATE),
              Response.genPostbackButton(i18n.__("feature.schedule"),FEATURE.SCHEDULE),
              Response.genPostbackButton(i18n.__("feature.survey"),FEATURE.SURVEY),
            ];
        return Response.genButtonTemplate(i18n.__("feature.prompt"), buttons);
      case FEATURE.LOGIN:
        this.user.setState(STATE.CONNECT_FACEBOOK);
        return Response.genText(i18n.__("email.input"));
      case FEATURE.REGISTER:
        this.user.setState(STATE.REGISTER);
        this.user.setStep(0);
        return Response.genQuickReply(i18n.__(registerSteps[0].phrase), [ quitQuickReply ]);
      case FEATURE.REGISTER_CONFIRM_YES:
        const newUser = {
          ...this.user.updateUserData,
          idFacebook: this.user.psid,
          password: '',
        }
        const { data } = await createUser(newUser);
        if (!data.error) {
          return this.handleConfirmCreateUser(true, i18n.__("register.success"));
        }
        console.log(data.error);
        return this.handleConfirmCreateUser(false, i18n.__("register.failed"));
      case FEATURE.REGISTER_CONFIRM_NO:
        return this.handleConfirmCreateUser(false, i18n.__("register.cancel"));
      case FEATURE.REGISTER_ROLE_LEANER:
        return this.handleChooseRole("learner");
      case FEATURE.REGISTER_ROLE_LECTURER:
        return this.handleChooseRole("lecturer");
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
