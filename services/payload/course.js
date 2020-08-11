"use strict";

const Response = require("../response"),
  config = require("../config"),
  i18n = require("../../i18n.config"),
  api = require("../api"),
  { COURSE, CART, STATE, QUIT, FEATURE } = require('../../utils/constant');
const { groupBy, min, isEqual } = require("lodash");

module.exports = class CourseService {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  generateCourseElementForSuggestion(item, invoice) {
    if (item) {
      const buttons = [
        Response.genWebUrlButton(i18n.__("course.detail"), `${config.clientUrl}/course-detail/${item._id}`),
        Response.genPostbackButton(i18n.__("suggestion.choose"), `${COURSE.CHOOSE_COURSE}_${item._id}`)
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

  generateCourseElement(item) {
    if (item) {
      const buttons = [
        Response.genWebUrlButton(i18n.__("course.detail"), `${config.clientUrl}/course-detail/${item._id}`),
        Response.genPostbackButton(i18n.__("course.review"), `${COURSE.REVIEW}_${item._id}`),
        Response.genPostbackButton(i18n.__("course.add_to_cart"), `${CART.ADD_TO_CART}_${item._id}`)
      ];
  
      return Response.genGenericElementTemplate(
        item.name,
        `Lecturer: ${item.lecturer.firstName} ${item.lecturer.lastName} - Price: $${item.price}`,
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

  genResponseForSuggestionCourse(course, sortedLevel, coursesByLevel) {
    const minLevel = min(sortedLevel);

    let elementsMinLevel = [];
    let elementsRemainLevel = [];
    for(let level of sortedLevel) {
      if (isEqual(minLevel, level)) {
        coursesByLevel[level].forEach(item => elementsMinLevel.push(this.generateCourseElement(item)));
      } else {
        coursesByLevel[level].forEach(item => elementsRemainLevel.push(this.generateCourseElement(item)));
      }
    }
    let response = [
      Response.genText(i18n.__('suggestion.min_level', { course_name: course.name })),
      Response.genGenericTemplate(elementsMinLevel),
    ];
    if (elementsRemainLevel.length !== 0) {
      response = response.concat([
        Response.genText(i18n.__('suggestion.remain_level')),
        Response.genGenericTemplate(elementsRemainLevel)
      ])
    }
    return response;
  }

  genSuggestCourseByView(suggestCoursesSortByView) {
    const elements = suggestCoursesSortByView.map(item => this.generateCourseElement(item));
    return [
      Response.genText(i18n.__('suggestion.sorted_course')),
      Response.genGenericTemplate(elements),
    ];
  }

  async handlePayload(payload) {
    let message = this.webhookEvent.message ? this.webhookEvent.message.text.trim().toLowerCase() : null;

    switch (payload) {
      case COURSE.COURSES:
        return await this.fetchCourse(message, false, 0, 3);
      case COURSE.POPULAR_COURSES: 
        return await this.fetchCourse('', true, 0, 10);
      case COURSE.LATEST_COURSES: 
        return await this.fetchCourse('', false, 0, 10);
      case COURSE.GUIDE:
        if (this.user.state === STATE.HELP_TUTORIAL) {
          const response = await this.fetchCourse('Javascript course', false, 0, 3);
          return [
            ...response,
            Response.genQuickReply(i18n.__('help.another_course'), [
              Response.genPostbackButton(i18n.__('help.quickReply_2'), FEATURE.CORONA_GUIDE),
              Response.genPostbackButton(i18n.__('help.skip'), QUIT)
            ])
          ]
        }
        this.user.setState(this.user.userData.idFacebook ? STATE.LOGED_IN : STATE.NONE);
        return Response.genText(i18n.__('fallback.error'));
        case COURSE.SUGGESTION:
          const response = await api.fetchInvoices(this.user.userData._id);
          if (!response.data.error) {
            const data = response.data.filter(e => !e.course.isDelete && e.invoice.status !== 'canceled' && e.invoice.status !== 'reported');
            if (data.length === 0) {
              return Response.genText(i18n.__("suggestion.no_course"));
            }
            const elements = data.map(element => {
              return this.generateCourseElementForSuggestion(element.course, element.invoice, element.timer);
            })
            
            let sliceElement = elements.length > 5 ? elements.slice(0, 5) : elements;
            
            return [
              Response.genText(i18n.__("suggestion.get_started")),
              Response.genGenericTemplate(sliceElement),
              elements.length > 10
              ? Response.genQuickReply(i18n.__("suggestion.course", { count: elements.length }), [
                Response.genPostbackButton(i18n.__("suggestion.view_all"), FEATURE.ALL_INVOICE)
              ])
              : Response.genText(i18n.__("suggestion.course", { count: elements.length }))
            ]
          }
          return Response.genQuickReply(i18n.__("fallback.error", { error: response.data.error }));
    }

    if (payload.includes(COURSE.REVIEW)) {
      const _idCourse = payload.substr(14, payload.length - 14);
      const response = await api.getReviewCourse(_idCourse); 
      if (!response.data.error) {
        const { rate, registered, viewed, sentiment, name } = response.data;
        return [
          Response.genText(i18n.__("course.review_prompt", { name })),
          Response.genQuickReply(i18n.__("course.course_review", { rate, registered, viewed, sentiment }), [
            Response.genPostbackButton(i18n.__("course.add_to_cart"), `${CART.ADD_TO_CART}_${_idCourse}`)
          ])
        ]
      }
      return Response.genQuickReply(i18n.__("fallback.error", { error: response.data.error }));
    }

    if (payload.includes(COURSE.CHOOSE_COURSE)) {
      const _idCourse = payload.substr(14, payload.length - 14);
      const courseResponse = await api.fetchCourse(_idCourse);
      const suggestCoursesResponse = await api.fetchSuggestCourse(_idCourse);
      const suggestCoursesSortByViewResponse = await api.fetchSuggestCourseSortByView(_idCourse);
      // Data
      const course = courseResponse.data;
      const suggestCourses = suggestCoursesResponse.data;
      const suggestCoursesSortByView = suggestCoursesSortByViewResponse.data;

      const coursesByLevel = groupBy(suggestCourses, 'level');
      
      if (course) {
        const sortedLevel = Object.keys(coursesByLevel).sort();
        const responseSuggestionCourse = this.genResponseForSuggestionCourse(course, sortedLevel, coursesByLevel);
        const responseSuggestionCourseByView = this.genSuggestCourseByView(suggestCoursesSortByView);
        return [
          ...responseSuggestionCourse,
          ...responseSuggestionCourseByView,
          Response.genQuickReply(i18n.__('suggestion.thanks'), [
            Response.genPostbackButton(i18n.__('suggestion.recommendation'), COURSE.SUGGESTION)
          ])
        ]
      }
      return Response.genText(i18n.__("fallback.error", { error: 'Your course not found' }));
    }
  }
};
    