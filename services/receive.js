"use strict";

const FeatureService = require("./payload/feature"),
  ProfileService = require('./payload/profile'),
  CourseService = require('./payload/course'),
  SubjectService = require('./payload/subject'),
  Response = require("./response"),
  GraphAPi = require("./graph-api"),
  config = require("./config"),
  i18n = require("../i18n.config"),
  NLP = require("./nlp"),
  { validURL } = require("../utils/helper"),
  users = require('../app'),
  { fetchUserByEmail, sendEmail } = require("./api"),
  { GET_STARTED, MENU, FEATURE, COURSE, PROFILE, IMAGES, SUBJECT, STATE, QUIT, SERVER_URL, CHATBOT_URL, registerSteps } = require('../utils/constant');

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  async handleMessage() {
    let event = this.webhookEvent;
    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = await this.handleQuickReply();
        } else if (message.attachments) {
          responses = await this.handleAttachmentMessage();
        } else if (message.text) {
          responses = await this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = await this.handlePostback();
      } else if (event.referral) {
        responses = await this.handleReferral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and will fix the issue shortly!`,
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 800);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  async handleTextMessage() {
    let message = this.webhookEvent.message.text.trim();
    let response;

    const quitQuickReply = Response.genPostbackButton(i18n.__("fallback.quit"), QUIT);

    switch(this.user.state) {
      case STATE.REGISTER:
        const { step } = this.user;
        const { userField } = registerSteps[step];
        let quickReplies = [ quitQuickReply ];

        switch(step) {
          case 1: // email
            const regex = /\S+@\S+\.\S+/;
            const email = message.toLowerCase();
            if (!regex.test(email)) {
              return Response.genQuickReply(i18n.__("email.invalid"), [ quitQuickReply ]);
            }
            break;
          case 4: // image
            if (message == 0) {
              message = `${SERVER_URL}/images/no-avatar.png`
            } else if (!validURL(message)) {
              return [
                Response.genQuickReply(i18n.__("register.invalid_url"), [ quitQuickReply ]),
                Response.genText(i18n.__("register.image_url"))
              ]
            } 
            break;
          case 5: // bio - nextStep: role
            quickReplies = [ 
              Response.genPostbackButton("Learner", FEATURE.REGISTER_ROLE_LEANER),
              Response.genPostbackButton("Lecturer", FEATURE.REGISTER_ROLE_LECTURER),
              quitQuickReply
            ];
        }

        if (userField) {
          this.user.setUpdateData({ [userField]: message });
        }
        this.user.setStep(step + 1);
        
        return Response.genQuickReply(i18n.__(registerSteps[step + 1].phrase), quickReplies);
      case STATE.CONNECT_FACEBOOK:
        const regex = /\S+@\S+\.\S+/;
        const email = message.toLowerCase();
        const registerQuickReply = { 
          title: i18n.__("email.register"),
          payload: FEATURE.REGISTER
        }

        if (regex.test(email)) {
          const { data } = await fetchUserByEmail(email);
          if (!data.error) {
            const responseSendEmail = await sendEmail(email, this.user.psid);
            if (!responseSendEmail.data.error) {
              this.user.setState(STATE.NONE);
              this.user.setUpdateData(data);
              console.log('recieve', users[this.user.psid]);
              return Response.genText(i18n.__("email.confirm", { email }));
            }
            return Response.genText(`An error has occured: '${responseSendEmail.data.error}'. We have been notified and will fix the issue shortly!`);
          } else {
            return Response.genQuickReply(i18n.__("email.not_found", { email }), [registerQuickReply, quitQuickReply])
          }
        } else {
          return Response.genQuickReply(i18n.__("email.invalid"), [quitQuickReply])
        }
      default:
        let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");
        let bye = this.firstEntity(this.webhookEvent.message.nlp, "bye");
        const result = await NLP.process(message.toLowerCase());
        const { intent, answers } = result;
        console.log("Message: ", message, " - Intent: ", intent);
    
        
        if (greeting && greeting.confidence > 0.8) {
          response = Response.genGetStartedMessage(this.user);
        } else if (bye && bye.confidence > 0.8) {
          response = Response.genByeMessage(this.user);
        } else if (intent !== "None") {
          switch (intent) {
            case "course": 
              response = await this.handlePayload(COURSE.COURSES);
              break;
            case "subject": 
              response = await this.handlePayload(SUBJECT.SUBJECTS);
              break;
            case "feedback":
              response = [
                Response.genText(answers[Math.floor(Math.random() * answers.length)].answer),
                Response.genImageTemplate(IMAGES.FEEDBACK)
              ]
              break;
            case "report":
              response = [
                Response.genText(answers[Math.floor(Math.random() * answers.length)].answer),
                Response.genImageTemplate(IMAGES.REPORT)
              ]
              break;
            default:
              const { answer } = answers[Math.floor(Math.random() * answers.length)];
              response = Response.genText(answer);
          }
        } else {
          response = Response.genText(
            i18n.__("fallback.any", { message: this.webhookEvent.message.text })
          );
        }
        return response;
    }
    
  }

  async handleAttachmentMessage() {
    let response;

    let attachment = this.webhookEvent.message.attachments[0];
    const { payload, type } = attachment;
    const quitQuickReply = Response.genPostbackButton(i18n.__("fallback.quit"), QUIT);

    switch(this.user.state) {
      case STATE.REGISTER:
        const { step } = this.user;

        if (step === 4) {
          if (type !== "image") {
            return [
              Response.genQuickReply(i18n.__("register.invalid_attachment"), [ quitQuickReply ]),
              Response.genText(i18n.__("register.image_url"))
            ]
          } 
          this.user.setUpdateData({ imageURL: payload.url });
        }

        this.user.setStep(step + 1);
        return Response.genQuickReply(i18n.__(registerSteps[step + 1].phrase), [ quitQuickReply ]);
      default: response = Response.genText(i18n.__("fallback.attachment"));
    }
    return response;
  }

  // Handles mesage events with quick replies
  async handleQuickReply() {
    let payload = this.webhookEvent.message.quick_reply.payload;
    return await this.handlePayload(payload);
  }

  // Handles postbacks events
  async handlePostback() {
    let postback = this.webhookEvent.postback;

    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      payload = postback.payload;
    }
    return await this.handlePayload(payload);
  }

  // Handles referral events
  async handleReferral() {
    let payload = this.webhookEvent.referral.ref.toUpperCase();
    return await this.handlePayload(payload);
  }

  async handlePayload(payload) {
    console.log("Received Payload: ", `${payload}`);

    GraphAPi.callFBAEventsAPI(this.user.psid, payload);

    if (payload === GET_STARTED || payload === QUIT) {
      this.user.setStep(0);
      this.user.setState(this.user.userData.idFacebook ? STATE.LOGED_IN : STATE.NONE);
      return Response.genGetStartedMessage(this.user);
    } else if (payload === MENU.WEBSITE) {
      return Response.genText(i18n.__("website.home"));
    } else if (payload.includes("FEATURE")) {
      const feature = new FeatureService(this.user, this.webhookEvent);
      return await feature.handlePayload(payload);
    } else if (payload.includes("PROFILE")) {
      const profile = new ProfileService(this.user, this.webhookEvent);
      return await profile.handlePayload(payload);
    } else if (payload.includes("COURSE")) {
      const course = new CourseService(this.user, this.webhookEvent);
      return await course.handlePayload(payload);
    } else if (payload.includes("SUBJECT")) {
      const subject = new SubjectService(this.user, this.webhookEvent);
      return await subject.handlePayload(payload);
    } else {
      return Response.genText(`This is a default postback message for payload: ${payload}!`);
    }
  }

  handlePrivateReply(type, object_id) {
    let welcomeMessage =
      i18n.__("get_started.welcome") + ". " + i18n.__("get_started.help");

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.suggestion"),
        payload: "CURATION",
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP",
      },
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id,
      },
      message: response,
    };

    GraphAPi.callSendAPI(requestBody);
  }

  markSeen() {
    let body = {
      recipient: {
        id: this.user.psid,
      },
      sender_action: "mark_seen",
    };
    GraphAPi.callSendAPI(body);
  }

  toggleTyping() {
    let body = {
      recipient: {
        id: this.user.psid,
      },
    };
    const typingOnBody = { ...body, sender_action: "typing_on" };
    const typingOffBody = { ...body, sender_action: "typing_off" };

    GraphAPi.callSendAPI(typingOnBody);
    setTimeout(() => GraphAPi.callSendAPI(typingOffBody), 1500);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    let requestBody = {
      recipient: {
        id: this.user.psid,
      },
      message: response,
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
        persona_id: persona_id,
      };
    }

    this.markSeen();
    this.toggleTyping();
    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
