"use strict";

const Response = require("../response"),
  config = require("../config"), 
  i18n = require("../../i18n.config"),
  queryString = require('query-string'),
  { getDayString } = require('../../utils/helper'),
  { createUser, createTimer, fetchInvoices, updateTimer, fetchCoronaSummaryWorldAndVietNam, fetchCoronaSummary } = require('../api'),
  jwtExtension = require('jsonwebtoken'),
  generator = require('generate-password'),
  { FEATURE, STATE, registerSteps, scheduleSteps, QUIT, MENU, PROFILE, CLIENT_URL, JWT_SECRET, CART, helpSteps, IMAGES, COURSE } = require('../../utils/constant');

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
    return Response.genQuickReply(i18n.__("schedule.failed"), [
      scheduleFeature,
      Response.genPostbackButton(i18n.__("menu.features", MENU.FEATURES))
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
        const buttons = !this.user.userData._id ? [
            Response.genPostbackButton(i18n.__("feature.login"), FEATURE.LOGIN),
            Response.genPostbackButton(i18n.__("feature.register"),FEATURE.REGISTER),
            Response.genPostbackButton(i18n.__("feature.survey"),FEATURE.SURVEY),
          ] : [ 
            Response.genPostbackButton(i18n.__("feature.update_profile"),PROFILE.UPDATE),
            Response.genPostbackButton(i18n.__("feature.survey"),FEATURE.SURVEY),
          ];
        
        if (this.user.userData.role === 'learner') {
          buttons.push(Response.genPostbackButton(i18n.__("feature.schedule"),FEATURE.SCHEDULE))
        }

        response = [ Response.genButtonTemplate(i18n.__("feature.prompt"), buttons) ]
        return !this.user.userData._id 
          ? response
          : [ ...response, Response.genQuickReply(i18n.__("feature.get_more_feature"), [Response.genPostbackButton(i18n.__("feature.more_feature"), FEATURE.MORE_FEATURE)])];
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
        const password = generator.generate({ length: 8, uppercase: false });

        const newUser = {
          ...this.user.updateUserData,
          idFacebook: this.user.psid,
          password: password,
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
      case FEATURE.HELP:
        return [
          Response.genText(i18n.__("help.support_0")),
          Response.genText(i18n.__("help.support_1")),
          Response.genText(i18n.__("help.support_2")),
          Response.genText(i18n.__("help.support_3")),
          Response.genQuickReply(i18n.__("help.prompt"), [ 
            Response.genPostbackButton(i18n.__("menu.get_started"), QUIT)
          ])
        ]
      case FEATURE.COVID19_GLOBAL:
        response = await fetchCoronaSummary();
        if (response.data) {
          const { Global } = response.data;
          const {
            TotalConfirmed,
            NewDeaths,
            TotalRecovered,
            NewConfirmed,
            NewRecovered,
            TotalDeaths
          } = Global;
          return [
            Response.genText(i18n.__("corona.world")),
            Response.genText(
              i18n.__("corona.prompt", {
                confirmed: TotalConfirmed,
                newdeaths: NewDeaths,
                deaths: TotalDeaths,
                recovered: TotalRecovered,
                newconfirmed: NewConfirmed,
                newrecovered: NewRecovered
              })
            ),
            Response.genQuickReply(i18n.__("corona.vietnam"), [
              Response.genPostbackButton(i18n.__("feature.vietnam"), FEATURE.COVID19_VN)
            ])
          ]
        }
        return Response.genText(i18n.__("fallback.error"));

      case FEATURE.COVID19_VN:
        response = await fetchCoronaSummary();
        if (response.data) {
          const countries = response.data.Countries;
          const vietnam = countries.find(value => value.CountryCode === "VN");
          if (vietnam) {
            const {
              TotalConfirmed,
              NewDeaths,
              TotalDeaths,
              TotalRecovered,
              Date,
              NewConfirmed,
              NewRecovered,
            } = vietnam;
            const date = Date.substr(0,10);
            return [
              Response.genText(i18n.__("feature.vietnam")),
              Response.genText(
                i18n.__("corona.prompt", {
                  confirmed: TotalConfirmed,
                  newdeaths: NewDeaths,
                  deaths: TotalDeaths,
                  recovered: TotalRecovered,
                  date,
                  newconfirmed: NewConfirmed,
                  newrecovered: NewRecovered
                })
              ),
            ];
          }
        }
        return Response.genText(i18n.__("fallback.error"));

      case FEATURE.FEATURE_GET_STARTED_HELP:
        this.user.setState(STATE.HELP_TUTORIAL);
        this.user.setStep(1);
        return Response.genQuickReply(i18n.__(helpSteps[0].phrase), [
          Response.genPostbackButton(i18n.__('help.next'), FEATURE.FEATURE_GET_STARTED_HELP_STEP),
          Response.genPostbackButton(i18n.__('help.skip'), QUIT)
        ])
      case FEATURE.FEATURE_GET_STARTED_HELP_STEP:
        const { step } = this.user;
        const quickReplyHelp = Response.genQuickReply(i18n.__(helpSteps[step].phrase), [
          Response.genPostbackButton(i18n.__('help.next'), FEATURE.FEATURE_GET_STARTED_HELP_STEP),
          Response.genPostbackButton(i18n.__('help.skip'), QUIT)
        ]);
        response = quickReplyHelp;

        switch(step) {
          case 2: response = [
            Response.genImageTemplate(IMAGES.FACEBOOK_BUTTON),
            quickReplyHelp 
          ]
          break;
          case 3: response = [
            Response.genQuickReply(i18n.__(helpSteps[step].phrase), [
              Response.genPostbackButton(i18n.__('help.quickReply_1'), COURSE.GUIDE),
              Response.genPostbackButton(i18n.__('help.skip'), QUIT)
            ])
          ]
          break;
          case 4: 
            this.user.setStep(0);
            this.user.setState(this.user.userData.idFacebook ? STATE.LOGED_IN : STATE.NONE);
            return [
              Response.genButtonTemplate(i18n.__(helpSteps[4].phrase), [
                Response.genPostbackButton(i18n.__('help.chat'), QUIT)
              ])
            ];
        }
        this.user.setStep(step + 1);
        return response;
      case FEATURE.CORONA_GUIDE:
        if (this.user.state === STATE.HELP_TUTORIAL) {
          response = await fetchCoronaSummary();
          if (response.data) {
            const { Global } = response.data;
            const {
              TotalConfirmed,
              NewDeaths,
              TotalRecovered,
              NewConfirmed,
              NewRecovered,
              TotalDeaths
            } = Global;
            return [
              Response.genText(i18n.__("corona.world")),
              Response.genQuickReply(i18n.__("corona.prompt", {
                confirmed: TotalConfirmed,
                newdeaths: NewDeaths,
                deaths: TotalDeaths,
                recovered: TotalRecovered,
                newconfirmed: NewConfirmed,
                newrecovered: NewRecovered
              }), [
                Response.genPostbackButton(i18n.__('help.next'), FEATURE.FEATURE_GET_STARTED_HELP_STEP)
              ])
            ]
          }
        }
        this.user.setState(this.user.userData.idFacebook ? STATE.LOGED_IN : STATE.NONE);
        return Response.genText(i18n.__('fallback.error'));
    }

    if (payload.includes(FEATURE.ADD_SCHEDULE)) {
      const _idInvoice = payload.substr(21, payload.length - 21);
      this.user.setSchedule({ _idInvoice });
      this.user.setState(STATE.SCHEDULE);
      const { time, days } = this.user.schedule;
      if (time && days) {
        const { schedule } = this.user;
        this.user.setStep(2);
        let loginData = { ...this.user.userData, token: jwtExtension.sign(JSON.stringify(this.user.userData), JWT_SECRET), previousPath: '/profile?tab=invoices' };
        let query = queryString.stringify(loginData);
        return [
          Response.genButtonTemplate(i18n.__("schedule.info", { ...schedule, days: getDayString(days) }), [
            Response.genWebUrlButton(i18n.__("schedule.course_detail"), `${CLIENT_URL}/auth/login?${query}`)
          ]),
          Response.genQuickReply(i18n.__("schedule.confirm"), [
            Response.genPostbackButton(i18n.__("confirm.yes"), FEATURE.SCHEDULE_CONFIRM_YES),
            Response.genPostbackButton(i18n.__("confirm.no"), FEATURE.SCHEDULE_CONFIRM_NO),
            quitQuickReply,
          ])
        ]
      }
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
