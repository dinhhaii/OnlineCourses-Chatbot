"use strict";

require("dotenv").config();

// Required environment variables
const ENV_VARS = [
  "PAGE_ID",
  "APP_ID",
  "PAGE_ACCESS_TOKEN",
  "APP_SECRET",
  "VERIFY_TOKEN",
  "APP_URL",
  "CLIENT_URL"
];

module.exports = {
  // Messenger Platform API
  mPlatformDomain: "https://graph.facebook.com",
  mPlatformVersion: "v7.0",

  // Page and Application information
  pageId: process.env.PAGE_ID,
  appId: process.env.APP_ID,
  pageAccesToken: process.env.PAGE_ACCESS_TOKEN,
  appSecret: process.env.APP_SECRET,
  verifyToken: process.env.VERIFY_TOKEN,
  appUrl: process.env.APP_URL,
  clientUrl: process.env.CLIENT_URL,

  // Persona IDs
  personas: {},

  // Preferred port (default to 3003)
  port: process.env.PORT || 3003,

  get mPlatfom() {
    return this.mPlatformDomain + "/" + this.mPlatformVersion;
  },

  // URL of your webhook endpoint
  get webhookUrl() {
    return this.appUrl + "/webhook";
  },

  get newPersonas() {
    return [
      {
        name: "Hai",
        picture: `${this.appUrl}/personas/technical.jpg`
      },
      {
        name: "Tom",
        picture: `${this.appUrl}/personas/care.png`
      }
    ];
  },

  pushPersona(persona) {
    this.personas[persona.name] = persona.id;
  },

  get personaTechnical() {
    let id = process.env.PERSONA_TECHNICAL;
    return {
      name: "Hai",
      id
    };
  },

  get personaCare() {
    let id = process.env.PERSONA_CARE;
    return {
      name: "Tom",
      id
    };
  },

  get whitelistedDomains() {
    return [this.appUrl, this.clientUrl];
  },

  checkEnvVariables: function() {
    ENV_VARS.forEach(function(key) {
      if (!process.env[key]) {
        console.log("WARNING: Missing the environment variable " + key);
      } else {
        // Check that urls use https
        if (["APP_URL", "CLIENT_URL"].includes(key)) {
          const url = process.env[key];
          if (!url.startsWith("https://")) {
            console.log(
              "WARNING: Your " + key + ' does not begin with "https://"'
            );
          }
        }
      }
    });
  }
};
