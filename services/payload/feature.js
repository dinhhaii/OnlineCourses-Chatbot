"use strict";

const Response = require("../response"),
  config = require("../config"), 
  i18n = require("../../i18n.config"),
  queryString = require('query-string'),
  { createUser } = require('../api'),
  jwtExtension = require('jsonwebtoken'),
  generator = require('generate-password'),
  { FEATURE, STATE, registerSteps, QUIT, MENU, PROFILE, CLIENT_URL, JWT_SECRET, CART } = require('../../utils/constant');

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
      let query = queryString.stringify(this.user.userData);
      query += "&previousPath=/profile?tab=change-password";
      return [
        Response.genText(text),
        Response.genButtonTemplate(i18n.__("register.change_password", { password }), [
          Response.genWebUrlButton(i18n.__("feature.change_password"),`${CLIENT_URL}/auth/login?${query}`),
        ]),
      ];
    } 
    this.user.setState(STATE.NONE);
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
        return !this.user.userData._id ? Response.genButtonTemplate(i18n.__("feature.prompt"), [
          Response.genPostbackButton(i18n.__("feature.login"), FEATURE.LOGIN),
          Response.genPostbackButton(i18n.__("feature.register"),FEATURE.REGISTER),
          Response.genPostbackButton(i18n.__("feature.survey"),FEATURE.SURVEY),
        ]) : [
          Response.genButtonTemplate(i18n.__("feature.prompt"), [ 
            Response.genPostbackButton(i18n.__("feature.update_profile"),PROFILE.UPDATE),
            Response.genPostbackButton(i18n.__("feature.schedule"),FEATURE.SCHEDULE),
            Response.genPostbackButton(i18n.__("feature.survey"),FEATURE.SURVEY),
          ]),
          Response.genQuickReply(i18n.__("feature.get_more_feature"), [Response.genPostbackButton(i18n.__("feature.more_feature"), FEATURE.MORE_FEATURE)])
        ];
      case FEATURE.LOGIN:
        switch(this.user.state) {
          case STATE.NONE: 
            this.user.setState(STATE.CONNECT_FACEBOOK);
            return Response.genQuickReply(i18n.__("email.input"), [ quitQuickReply ]);
          case STATE.LOGED_IN: 
            let loginData = { ...this.user.userData, token: jwtExtension.sign(JSON.stringify(this.user.userData), JWT_SECRET) };
            let query = queryString.stringify(loginData);
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
      case FEATURE.MORE_FEATURE: 
        return [
          Response.genButtonTemplate(i18n.__("feature.cart"), [
            Response.genPostbackButton(i18n.__("feature.check_cart"), CART.CHECK_CART),
            Response.genPostbackButton(i18n.__("feature.add_coupon"), CART.ADD_COUPON),
            Response.genPostbackButton(i18n.__("feature.payment"), CART.PAYMENT),
          ]),
          Response.genButtonTemplate(i18n.__("feature.profile"), [
            Response.genPostbackButton(i18n.__("feature.quick_login"), FEATURE.LOGIN),
            Response.genPostbackButton(i18n.__("feature.change_password"), PROFILE.CHANGE_PASSWORD),
            Response.genPostbackButton(i18n.__("feature.forgot_password"), PROFILE.FORGOT_PASSWORD),
          ])
        ]
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
