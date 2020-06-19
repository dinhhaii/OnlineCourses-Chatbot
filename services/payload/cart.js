"use strict";

const Response = require("../response"),
  config = require("../config"), 
  i18n = require("../../i18n.config"),
  queryString = require('query-string'),
  { fetchCart, addCourseToCart, removeCourseFromCart } = require('../api'),
  jwtExtension = require('jsonwebtoken'),
  { CART, STATE, QUIT, PROFILE, CLIENT_URL, JWT_SECRET, updateProfileSteps } = require('../../utils/constant');

module.exports = class CartService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  generateCourseElement(item) {
    const { course, discount } = item;

    if (course) {
      const buttons = [
        Response.genWebUrlButton(i18n.__("course.detail"), `${config.shopUrl}/course-detail/${course._id}`),
        Response.genPostbackButton(i18n.__("feature.remove"), `${CART.REMOVE_COURSE}_${course._id}`)
      ];
  
      return Response.genGenericElementTemplate(
        course.name,
        discount ? `Discount: -${discount.percentage}% (${discount.code})` : 'Discount: -0%',
        course.imageURL,
        buttons,
        {
          type: "web_url",
          url: `${config.shopUrl}/course-detail/${course._id}`,
          messenger_extensions: true,
          webview_height_ratio: "tall",
          fallback_url: `${config.shopUrl}`
        }
      );
    }
    return;
  };

  async handlePayload(payload) {
    let loginData = { ...this.user.userData, token: jwtExtension.sign(JSON.stringify(this.user.userData), JWT_SECRET) };
    let query = queryString.stringify(loginData);
    const quitQuickReply = Response.genPostbackButton(i18n.__("fallback.quit"), QUIT);

    if (this.user.state === STATE.LOGED_IN) {
        if (payload === CART.CHECK_CART) {
            const { data } = await fetchCart(this.user.userData._id);
            if (!data.error) {
                this.user.setCart(data);
                query += "&previousPath=/cart";
                const { items } = data;

                const total = items.reduce((initValue, value) => initValue + (value.discount ? value.course.price * (100 - value.discount.percentage) / 100 : value.course.price), 0);
                const subtotal = items.reduce((initValue, value) => initValue + value.course.price , 0);

                const summary = Response.genReceiptSummary(subtotal, total);
                const elements = items.map(item => {
                    const { name, price, imageURL } = item.course;
                    const promo = item.discount ? `Discount: -${item.discount.percentage}% (${item.discount.code})` : 'Discount: 0%';
                    return Response.genReceiptElementTemplate(name, promo , 1, price, imageURL);
                });
                const adjustments = [{ name: "Discount", amount: total - subtotal }];

                return [
                    Response.genReceiptTemplate(`${this.user.userData.firstName} ${this.user.userData.lastName}`, data._id, summary, elements, adjustments),
                    Response.genButtonTemplate(i18n.__("cart.payment"), [ 
                        Response.genWebUrlButton(i18n.__("feature.payment"), `${CLIENT_URL}/auth/login?${query}`),
                        Response.genPostbackButton(i18n.__("feature.edit_cart"), CART.REMOVE_COURSE)
                    ])
                ]
            }
            return Response.genText(i18n.__("cart.not_found"));
        } else if (payload === CART.PAYMENT) {
            query += "&previousPath=/cart";
            return Response.genButtonTemplate(i18n.__("cart.payment"), [ 
                Response.genPostbackButton(i18n.__("feature.check_cart"), CART.CHECK_CART),
                Response.genWebUrlButton(i18n.__("feature.payment"), `${CLIENT_URL}/auth/login?${query}`)
            ])
        } else if (payload === CART.ADD_COUPON) {
            this.user.setState(STATE.ADD_COUPON);
            return Response.genQuickReply(i18n.__("cart.add_code"), [ quitQuickReply ]);
        } else if (payload.includes(CART.ADD_TO_CART)) {
            const idCourse = payload.substr(12, payload.length - 12);
            const { data } = await addCourseToCart(this.user.userData._id, idCourse);
            if (!data.error) {
                return Response.genQuickReply(i18n.__("cart.add_course_success"), [
                    Response.genPostbackButton(i18n.__("feature.check_cart"), CART.CHECK_CART)
                ])
            }
            return Response.genText(i18n.__("fallback.error", { error: data.error }));
        } else if (payload.includes(CART.REMOVE_COURSE)) {
            if (payload === CART.REMOVE_COURSE) {
                const { data } = await fetchCart(this.user.userData._id);
                if (!data.error) {
                    const elements = data.items.map(item => this.generateCourseElement(item));
                    return Response.genGenericTemplate(elements);
                }
                return Response.genText(i18n.__("fallback.error", { error: data.error }));
            }

            const idCourse = payload.substr(11, payload.length - 11);
            const { data } = await removeCourseFromCart(this.user.userData._id, idCourse);
            if (!data.error) {
                return Response.genQuickReply(i18n.__("cart.remove_course_success"), [
                    Response.genPostbackButton(i18n.__("feature.check_cart"), CART.CHECK_CART)
                ])
            }
            return Response.genText(i18n.__("fallback.error", { error: data.error }));
        }
    }

    return Response.genText(i18n.__("cart.prevent"));
  }
};
