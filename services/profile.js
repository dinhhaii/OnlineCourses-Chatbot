"use strict";

// Imports dependencies
const GraphAPi = require("./graph-api"),
  i18n = require("../i18n.config"),
  config = require("./config"),
  locales = i18n.getLocales(),
  constant = require('../utils/constant');

module.exports = class Profile {
  // SET
  setWebhook() {
    GraphAPi.callSubscriptionsAPI();
    GraphAPi.callSubscribedApps();
  }

  setPageFeedWebhook() {
    GraphAPi.callSubscriptionsAPI("feed");
    GraphAPi.callSubscribedApps("feed");
  }

  setThread() {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting(),
      ...this.getPersistentMenu()
    };

    GraphAPi.callMessengerProfileAPI(profilePayload);
  }

  setPersonas() {
    let newPersonas = config.newPersonas;

    GraphAPi.getPersonaAPI()
      .then(personas => {
        for (let persona of personas) {
          config.pushPersona({
            name: persona.name,
            id: persona.id
          });
        }
        console.log(config.personas);
        return config.personas;
      })
      .then(existingPersonas => {
        for (let persona of newPersonas) {
          if (!(persona.name in existingPersonas)) {
            GraphAPi.postPersonaAPI(persona.name, persona.picture)
              .then(personaId => {
                config.pushPersona({
                  name: persona.name,
                  id: personaId
                });
                console.log(config.personas);
              })
              .catch(error => {
                console.log("Creation failed:", error);
              });
          } else {
            console.log("Persona already exists for name:", persona.name);
          }
        }
      })
      .catch(error => {
        console.log("Creation failed:", error);
      });
  }

  setGetStarted() {
    let getStartedPayload = this.getGetStarted();
    GraphAPi.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    let greetingPayload = this.getGreeting();
    GraphAPi.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuPayload = this.getPersistentMenu();
    GraphAPi.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    let domainPayload = this.getWhitelistedDomains();
    GraphAPi.callMessengerProfileAPI(domainPayload);
  }

  // GET
  getGetStarted() {
    return {
      get_started: {
        payload: "GET_STARTED"
      }
    };
  }

  getGreeting() {
    let greetings = [];

    for (let locale of locales) {
      greetings.push(this.getGreetingText(locale));
    }

    return { greeting: greetings };
  }

  getPersistentMenu() {
    let menuItems = [];

    for (let locale of locales) {
      menuItems.push(this.getMenuItems(locale));
    }

    return { persistent_menu: menuItems };
  }

  getGreetingText(locale) {
    let param = locale === "en_US" ? "default" : locale;

    i18n.setLocale(locale);

    let localizedGreeting = {
      locale: param,
      text: i18n.__("profile.greeting", { user_first_name: "{{user_first_name}}" })
    };

    return localizedGreeting;
  }

  getMenuItems(locale) {
    let param = locale === "en_US" ? "default" : locale;

    i18n.setLocale(locale);

    let localizedMenu = {
      locale: param,
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: i18n.__("menu.features"),
          type: "nested",
          call_to_actions: [
            {
              title: i18n.__("feature.login"),
              type: "postback",
              payload: constant.FEATURE.LOGIN
            },
            {
              title: i18n.__("feature.register"),
              type: "postback",
              payload: constant.FEATURE.REGISTER
            }
          ]
        },
        {
          title: i18n.__("menu.help"),
          type: "postback",
          payload: constant.FEATURE.HELP
        },
        {
          title: i18n.__("menu.website"),
          type: "web_url",
          url: config.clientUrl,
          webview_height_ratio: "full"
        }
      ]
    };

    return localizedMenu;
  }

  getWhitelistedDomains() {
    let whitelistedDomains = {
      whitelisted_domains: config.whitelistedDomains
    };

    return whitelistedDomains;
  }
};
