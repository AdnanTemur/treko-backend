const accessTokenExpires = 24 * 60 * 60;
const refreshTokenExpires = 24 * 60 * 60;

let accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 1000),
  maxAge: accessTokenExpires * 1000,
  httpOnly: true,
  sameSite: true,
};

let refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 1000),
  maxAge: refreshTokenExpires * 1000,
  httpOnly: true,
  sameSite: true,
};

const sendToken = (user, statusCode, res) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({ user, accessToken, refreshToken });
};

module.exports = { sendToken, accessTokenOptions, refreshTokenOptions };
