module.exports = {
  // SERVER_URL: "http://localhost:3000",
  // CLIENT_URL: "http://localhost:3001",
  // ADMIN_URL: "http://locahost:3002",
  SERVER_URL: "https://hacademy-api.herokuapp.com",
  CLIENT_URL: "https://cafocc.web.app",
  ADMIN_URL: "https://cafocc-cms.web.app",
  JWT_SECRET: "jwt_secret",
  GET_STARTED: "GET_STARTED",
  QUIT: "QUIT",
  MENU: {
    WEBSITE: "MENU_WEBSITE",
    HELP: "MENU_HELP",
    FEATURES: "MENU_FEATURE",
  },
  FEATURE: {
    LOGIN: "FEATURE_LOGIN",
    REGISTER: "FEATURE_REGISTER",
    REGISTER_CONFIRM_YES: "FEATURE_REGISTER_YES",
    REGISTER_CONFIRM_NO: "FEATURE_REGISTER_NO",
    REGISTER_ROLE_LEANER: "FEATURE_ROLE_LEANER",
    REGISTER_ROLE_LECTURER: "FEATURE_ROLE_LECTURER",
    LOGOUT: "FEATURE_LOGOUT",
    SURVEY: "FEATURE_SURVEY",
    SCHEDULE: "FEATURE_SCHEDULE",
    SCHEDULE_CONFIRM_YES: "FEATURE_SCHEDULE_YES",
    SCHEDULE_CONFIRM_NO: "FEATURE_SCHEDULE_NO",
    ADD_SCHEDULE: "ADD_SCHEDULE_FEATURE",
    REMOVE_SCHEDULE: "REMOVE_SCHEDULE_FEATURE",
    MORE_FEATURE: "MORE_FEATURE",
    HELP: "FEATURE_HELP",
    ALL_INVOICE: "FEATURE_ALL_INVOICE"
  },
  COURSE: {
    COURSES: "COURSES",
    POPULAR_COURSES: "POPULAR_COURSES",
    LATEST_COURSES: "LATEST_COURSES",
  },
  SUBJECT: {
    SUBJECTS: "SUBJECTS",
    ALL_SUBJECTS: "ALL_SUBJECTS",
  },
  PROFILE: {
    UPDATE: "UPDATE_PROFILE",
    UPDATE_CONFIRM_YES: "PROFILE_UPDATE_YES",
    UPDATE_CONFIRM_NO: "PROFILE_UPDATE_NO",
    FORGOT_PASSWORD: "PROFILE_FORGOT_PASSWORD",
    CHANGE_PASSWORD: "PROFILE_CHANGE_PASSWORD",
  },
  CART: {
    CHECK_CART: "CHECK_CART",
    ADD_TO_CART: "ADD_TO_CART",
    UPDATE_CART: "UPDATE_CART",
    ADD_COUPON: "ADD_COUPON_CART",
    PAYMENT: "CART_PAYMENT",
    REMOVE_COURSE: "CART_REMOVE",
  },
  IMAGES: {
    FEEDBACK:
      "https://firebasestorage.googleapis.com/v0/b/cafocc.appspot.com/o/images%2Ffeedback.png?alt=media&token=de9d26a4-f2d3-4ee7-87bf-cfc192842d54",
    REPORT:
      "https://firebasestorage.googleapis.com/v0/b/cafocc.appspot.com/o/images%2Freport.png?alt=media&token=11395ddd-076b-43d7-9b93-39fb5560faa8",
  },
  STATE: {
    LOGED_IN: "LOGED_IN",
    UPDATE_USER: "UPDATE_USER",
    CONNECT_FACEBOOK: "CONNECT_FACEBOOK",
    NONE: "NONE",
    ADD_COUPON: "ADD_COUPON",
    REGISTER: "REGISTER",
    CONDUCT_SURVEYS: "CONDUCT_SURVEYS",
    SCHEDULE: "SCHEDULE"
  },
  registerSteps: [
    { phrase: "register.get_started"},
    { phrase: "register.email", userField: "email" },
    { phrase: "register.first_name", userField: "firstName" },
    { phrase: "register.last_name", userField: "lastName" },
    { phrase: "register.image_url", userField: "imageURL" },
    { phrase: "register.bio", userField: "bio" },
    { phrase: "register.role"},
    { phrase: "register.info"}
  ],
  updateProfileSteps: [
    { phrase: "update.get_started"},
    { phrase: "update.email", userField: "email" },
    { phrase: "update.first_name", userField: "firstName" },
    { phrase: "update.last_name", userField: "lastName" },
    { phrase: "update.image_url", userField: "imageURL" },
    { phrase: "update.bio", userField: "bio" },
    { phrase: "update.info"}
  ],
  scheduleSteps: [
    { phrase: "schedule.time", field: "time" },
    { phrase: "schedule.days", field: "days" },
    { phrase: "schedule.info" }
  ]
};
