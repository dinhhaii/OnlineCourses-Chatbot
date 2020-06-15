module.exports = {
  SERVER_URL: "http://localhost:3000",
  CLIENT_URL: "http://localhost:3001",
  CHATBOT_URL: "http://localhost:3003",
  // SERVER_URL: "https://hacademy-api.herokuapp.com",
  // CLIENT_URL: "https://cafocc.web.app",
  // CHATBOT_URL: "https://hacademy-chatbot.herokuapp.com",
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
    CHECK_CART: "PROFILE_CHECK_CART",
    ADD_TO_CART: "PROFILE_ADD_TO_CART",
    PAYMENT: "PROFILE_PAYMENT",
    CHANGE_FIRSTNAME: "PROFILE_CHANGE_FIRSTNAME",
    CHANGE_LASTNAME: "PROFILE_CHANGE_LASTNAME",
    CHANGE_IMAGEURL: "PROFILE_CHANGE_IMAGEURL",
    FORGOT_PASSWORD: "PROFILE_FORGOT_PASSWORD",
    CHANGE_PASSWORD: "PROFILE_CHANGE_PASSWORD",
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
    REGISTER: "REGISTER"
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
  ]
};
