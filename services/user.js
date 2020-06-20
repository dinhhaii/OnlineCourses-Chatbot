"use strict";
const { fetchCart, fetchUser } = require('./api'),
  { STATE } = require('../utils/constant');

module.exports = class User {
  constructor(psid, userData) {
    //Facebook account
    this.psid = psid;
    this.firstName = "";
    this.lastName = "";
    this.timezone = 7;
    this.locale = "en_US";
    this.gender = "neutral";
    
    // Account user
    this.state = STATE.NONE;
    this.step = 0;
    this.updateUserData = {};
    this.userData = {
      _id: "",
      email: "",
      password: "",
      imageURL: "",
      firstName: "",
      lastName: "",
      role: "",
      status: "",
      idFacebook: "",
    };
    this.carts = {};
    this.survey = {};

    if (userData) {
      this.userData = { ...userData };
    }
  }

  setUserData(userData) {
    if (userData) {
      this.userData = { ...userData };
    }
  }

  setUpdateData(data) {
    this.updateUserData = { ...this.updateUserData, ...data };
  }

  setProfileFacebook(profile) {
    if (profile) {
      this.firstName = profile.firstName;
      this.lastName = profile.lastName;
      this.locale = profile.locale;
      this.timezone = profile.timezone;
      if (profile.gender) {
        this.gender = profile.gender;
      }
    }
  }

  setCart(carts) {
    this.carts = carts;
  }

  setState(value) {
    this.state = value;
  }

  setStep(value) {
    this.step = value;
  }

  setSurvey(survey) {
    this.survey = { ...this.survey, survey };
  }

  resetSurvey() {
    this.survey = {};
  }

  resetUpdateData() {
    this.updateUserData = {};
  }

  checkUpdateUser() {
    for (let key of Object.keys(this.userData)) {
      if (this.userData[key] !== this.updateUserData[key]) {
        return false;
      }
    }
    return true;
  }

  async setProfile(userProfile) {
    const { id } = userProfile;
    this.setProfileFacebook(userProfile);
    if (id) {
      const { data } = await fetchUser(id);
      if (!data.error) {
        this.setState(STATE.LOGED_IN);
        this.setUserData(data);
      } else {
        console.error("User not found");
      }
    } else {
      console.error("Can't get profile user!");
    }
    return this;
  }
};
