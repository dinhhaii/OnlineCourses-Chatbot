"use strict";

const Response = require("../response"),
  config = require("../config"), 
  i18n = require("../../i18n.config"),
  queryString = require('query-string'),
  { createUser, createTimer, fetchInvoices, updateTimer } = require('../api'),
  jwtExtension = require('jsonwebtoken'),
  generator = require('generate-password'),
  { FEATURE, STATE, registerSteps, scheduleSteps, QUIT, MENU, PROFILE, CLIENT_URL, JWT_SECRET, CART } = require('../../utils/constant');

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

  handleConfirmCreateTimer(success) {
    const scheduleFeature = Response.genPostbackButton(i18n.__("feature.schedule"), FEATURE.SCHEDULE);
    
    this.user.setStep(0);
    this.user.resetSchedule();
    this.user.setState(STATE.LOGED_IN);

    if (success) {
      return Response.genQuickReply(i18n.__("schedule.success"), [ scheduleFeature ]);
    } 
    return Response.genQuickReply(i18n.__("schedule.failed"), [ scheduleFeature ]);
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

  generateCourseElementForSchedule(item, invoice, timer) {
    if (item) {
      const buttons = [
        Response.genWebUrlButton(i18n.__("course.detail"), `${config.clientUrl}/course-detail/${item._id}`),
        !timer || (timer && timer.status === 'canceled')
          ? Response.genPostbackButton(i18n.__("schedule.add_notification"), `${FEATURE.ADD_SCHEDULE}_${invoice._id}`)
          : Response.genPostbackButton(i18n.__("schedule.remove_notification"), `${FEATURE.REMOVE_SCHEDULE}_${invoice._id}`)
      ];

      return Response.genGenericElementTemplate(
        item.name,
        `Price: $${item.price} - Total: $${invoice.totalPrice}`,
        item.imageURL,
        buttons,
        {
          type: "web_url",
          url: `${config.clientUrl}/course-detail/${item._id}`,
          messenger_extensions: true,
          webview_height_ratio: "tall",
          fallback_url: `${config.clientUrl}`
        }
      );
    }
    return null;
  };

  async handlePayload(payload) {
    const quitQuickReply = Response.genPostbackButton(i18n.__("fallback.quit"), QUIT);
    const scheduleFeature = Response.genPostbackButton(i18n.__("feature.schedule"), FEATURE.SCHEDULE);

    let response;

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
        if (this.user.userData.role === "learner") {
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
        } else {
          return [
            Response.genButtonTemplate(i18n.__("feature.profile"), [
              Response.genPostbackButton(i18n.__("feature.quick_login"), FEATURE.LOGIN),
              Response.genPostbackButton(i18n.__("feature.change_password"), PROFILE.CHANGE_PASSWORD),
              Response.genPostbackButton(i18n.__("feature.forgot_password"), PROFILE.FORGOT_PASSWORD),
            ])
          ]
        }
        
      case FEATURE.SURVEY:
        this.user.setState(STATE.CONDUCT_SURVEYS);
        this.user.setStep(0);
        return [
          Response.genText(i18n.__("survey.prompt")),
          Response.genQuickReply(i18n.__("survey.content"), [ quitQuickReply ])
        ]
      case FEATURE.SCHEDULE:
        response = await fetchInvoices(this.user.userData._id);
        if (!response.data.error) {
          const data = response.data.filter(e => !e.course.isDelete && e.invoice.status !== 'canceled' && e.invoice.status !== 'reported');
          if (data.length === 0) {
            return Response.genText(i18n.__("schedule.no_course"));
          }
          const elements = data.map(element => {
            return this.generateCourseElementForSchedule(element.course, element.invoice, element.timer);
          })

          let sliceElement = elements.length > 10 ? elements.slice(0, 10) : elements;
          
          return [
            Response.genText(i18n.__("schedule.get_started")),
            Response.genGenericTemplate(sliceElement),
            elements.length > 10
              ? Response.genQuickReply(i18n.__("schedule.course", { count: elements.length }), [
                  Response.genPostbackButton(i18n.__("schedule.view_all"), FEATURE.ALL_INVOICE)
                ])
              : Response.genText(i18n.__("schedule.course", { count: elements.length }))
          ]
        }
        return Response.genQuickReply(i18n.__("fallback.error", { error: response.data.error }));
      case FEATURE.ALL_INVOICE:
        response = await fetchInvoices(this.user.userData._id);
        if (!response.data.error) {
          const data = response.data.filter(e => !e.course.isDelete && e.invoice.status !== 'canceled' && e.invoice.status !== 'reported');
          if (data.length === 0) {
            return Response.genText(i18n.__("schedule.no_course"));
          }
          let elements = data.map(element => {
            return this.generateCourseElementForSchedule(element.course, element.invoice, element.timer);
          })
          let index = 0;
          let allElements = [];
          while(elements.length > index) {
            allElements.push(elements.slice(index, index + 10));
            index += 10;
          }
          return [
            ...allElements.map(item => Response.genGenericTemplate(item)),
            Response.genText(i18n.__("schedule.course", { count: elements.length }))
          ]
        }
      case FEATURE.SCHEDULE_CONFIRM_YES:
        const { _idInvoice, time, days } = this.user.schedule;
        response = await createTimer(this.user.userData._id, _idInvoice, time, days);
        if (!response.data.error) {
          return this.handleConfirmCreateTimer(true);
        }
        return Response.genQuickReply(i18n.__("fallback.error", { error: response.data.error }), [ scheduleFeature, quitQuickReply ]);
      case FEATURE.SCHEDULE_CONFIRM_NO:
        return this.handleConfirmCreateTimer(false);

    }

    if (payload.includes(FEATURE.ADD_SCHEDULE)) {
      const _idInvoice = payload.substr(21, payload.length - 21);
      this.user.setSchedule({ _idInvoice });
      this.user.setState(STATE.SCHEDULE);
      this.user.setStep(0);
      return Response.genQuickReply(i18n.__(scheduleSteps[0].phrase), [ quitQuickReply ]);
    }

    if (payload.includes(FEATURE.REMOVE_SCHEDULE)) {
      const _idInvoice = payload.substr(24, payload.length - 24);
      this.user.setSchedule({ _idInvoice });
      response = await updateTimer(this.user.userData._id, _idInvoice, undefined , undefined, 'canceled');
      if (!response.data.error) {
        return Response.genQuickReply(i18n.__("schedule.cancel_success"), [
          Response.genPostbackButton(i18n.__("feature.schedule"), FEATURE.SCHEDULE)
        ]);
      }
      return Response.genQuickReply(i18n.__("fallback.error", { error: response.data.error }), [
        Response.genPostbackButton(i18n.__("feature.schedule"), FEATURE.SCHEDULE)
      ])
    }

    return [];
  }
};
