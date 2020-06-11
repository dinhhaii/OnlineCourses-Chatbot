"use strict";

module.exports = class User {
  constructor(psid, userData) {
    //Facebook account
    this.psid = psid;
    this.firstName = "";
    this.lastName = "";
    this.locale = "";
    this.timezone = "";
    this.gender = "neutral";
    // Account user
    this.isLogin = false;
    this.updateUserData = {};
    this.userData = {
      _id: "",
      email: "",
      password: "",
      imageURL: "",
      firstName: "",
      lastName: "",
      role: "",
      type: "",
      status: "",
    };
    this.carts = [];

    if (userData) {
      this.userData = { ...userData };
    }
  }

  setUserData(userData) {
    if (userData) {
      this.userData = { ...userData }
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
    this.carts = [ ...carts ];
  }

  setLogin(value) {
    this.isLogin = value;
  }

  checkUpdateUser() {
    for(let key of Object.keys(this.userData)) {
      if (this.userData[key] !== this.updateUserData[key]) {
        return false;
      }
    }
    return true;
  }

};
