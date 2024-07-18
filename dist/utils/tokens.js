"use strict";

var accessTokenExpires = 600; // 10 minutes in seconds
var refreshTokenExpires = 2700; // 45 minutes in seconds

var accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 1000),
  // Convert seconds to milliseconds
  maxAge: accessTokenExpires * 1000,
  // Convert seconds to milliseconds
  httpOnly: true,
  sameSite: true
};
var refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 1000),
  // Convert seconds to milliseconds
  maxAge: refreshTokenExpires * 1000,
  // Convert seconds to milliseconds
  httpOnly: true,
  sameSite: true
};
var sendToken = function sendToken(user, statusCode, res) {
  var accessToken = user.signAccessToken();
  var refreshToken = user.signRefreshToken();
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    user: user,
    accessToken: accessToken,
    refreshToken: refreshToken
  });
};
module.exports = {
  sendToken: sendToken,
  accessTokenOptions: accessTokenOptions,
  refreshTokenOptions: refreshTokenOptions
};