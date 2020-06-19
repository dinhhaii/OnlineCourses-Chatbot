"use strict";

const Response = require("../response"),
  config = require("../config"),
  i18n = require("../../i18n.config"),
  api = require("../api"),
  { COURSE, CART } = require('../../utils/constant');

module.exports = class CourseService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  generateCourseElement(item) {
    if (item) {
      const buttons = [
        Response.genWebUrlButton(i18n.__("course.detail"), `${config.shopUrl}/course-detail/${item._id}`),
        Response.genPostbackButton(i18n.__("course.add_to_cart"), `${CART.ADD_TO_CART}_${item._id}`)
      ];
  
      return Response.genGenericElementTemplate(
        item.name,
        `Lecturer: ${item.lecturer.firstName} ${item.lecturer.lastName} - Price: $${item.price}`,
        item.imageURL,
        buttons,
        {
          type: "web_url",
          url: `${config.shopUrl}/course-detail/${item._id}`,
          messenger_extensions: true,
          webview_height_ratio: "tall",
          fallback_url: `${config.shopUrl}`
        }
      );
    }
    return;
  };

  async fetchCourse(search, popular, offset, limit) {
    const { data } = await api.fetchCourses(search, popular, offset, limit);
    
    const quickReply = [
      {
        title: i18n.__("course.latest_courses"),
        payload: COURSE.LATEST_COURSES,
      },
      {
        title: i18n.__("course.popular_courses"),
        payload: COURSE.POPULAR_COURSES,
      },
    ];

    if (!data.error) {
      const elements = [];
      data.forEach(item => {
        elements.push(this.generateCourseElement(item));
      })
      if (data && data.length === 0) {
        return Response.genQuickReply(i18n.__("course.prompt-none"), quickReply);
      } else {
        return [
          Response.genGenericTemplate(elements),
          Response.genQuickReply(i18n.__("course.prompt"), quickReply),
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
      case COURSE.COURSES:
        return await this.fetchCourse(message, false, 0, 3);
      case COURSE.POPULAR_COURSES: 
        return await this.fetchCourse('', true, 0, 3);
      case COURSE.LATEST_COURSES: 
        return await this.fetchCourse('', false, 0, 5);
      default: return [];
    }
  }
};
