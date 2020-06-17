"use strict";

const Response = require("../response"),
  config = require("../config"), 
  i18n = require("../../i18n.config"),
  queryString = require('query-string'),
  { createUser } = require('../api'),
  generator = require('generate-password'),
  { FEATURE, STATE, registerSteps, QUIT, MENU, PROFILE, CLIENT_URL } = require('../../utils/constant');

module.exports = class FeatureService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleConfirmCreateUser(success, text, password) {
    this.user.setStep(0);
    this.user.resetUpdateData();
    if (success) {
      this.user.setState(STATE.LOGED_IN);
      const query = queryString.stringify(this.user.userData);
      return [
        Response.genText(text),
        Response.genButtonTemplate(i18n.__("register.change_password", { password }), [
          Response.genWebUrlButton(i18n.__("feature.access_page"),`${CLIENT_URL}/auth/login?${query}`),
        ]),
      ];
    } 
    this.user.setState(STATE.LOGED_IN);
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
        const buttons = !this.user.userData._id
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
        switch(this.user.state) {
          case STATE.NONE: 
            this.user.setState(STATE.CONNECT_FACEBOOK);
            return Response.genText(i18n.__("email.input"));
          case STATE.LOGED_IN: 
            const query = queryString.stringify(this.user.userData);
            return Response.genButtonTemplate(i18n.__("login.quick_login"), [
              Response.genWebUrlButton(i18n.__("feature.access_page"),`${CLIENT_URL}/auth/login?${query}`),
            ])
        }
      case FEATURE.REGISTER:
        this.user.setState(STATE.REGISTER);
        this.user.setStep(0);
        return Response.genQuickReply(i18n.__(registerSteps[0].phrase), [ quitQuickReply ]);
      case FEATURE.REGISTER_CONFIRM_YES:
        const password = generator.generate({ length: 8 });

        const newUser = {
          ...this.user.updateUserData,
          idFacebook: this.user.psid,
          password,
          status: 'verified'
        }
        const { data } = await createUser(newUser);
        if (!data.error) {
          this.user.setUserData(data);
          return this.handleConfirmCreateUser(true, i18n.__("register.success"), password);
        }
        return this.handleConfirmCreateUser(false, i18n.__("register.failed", { error: data.error }));
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
