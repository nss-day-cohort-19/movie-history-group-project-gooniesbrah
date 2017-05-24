"use strict";

let firebase = require("firebase/app"),

    //fb calls the fb getter file. making fbData = fb() calls that javascript file
    fb = require("./fb-getter"),
    fbData = fb();

require("firebase/auth");
require("firebase/database");

var config = {
  apiKey: fbData.apiKey,
  databaseURL: fbData.databaseURL,
  authDomain: fbData.authDomain,
  storageBucket: fbData.storageBucket
};

firebase.getFBsettings = function(){
    return config;
};




firebase.initializeApp(config);

module.exports = firebase;
