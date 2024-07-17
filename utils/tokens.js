const accessTokenExpires = 600; // 10 minutes in seconds
const refreshTokenExpires = 2700; // 45 minutes in seconds

let accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 1000), // Convert seconds to milliseconds
  maxAge: accessTokenExpires * 1000, // Convert seconds to milliseconds
  httpOnly: true,
  sameSite: true,
};

let refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 1000), // Convert seconds to milliseconds
  maxAge: refreshTokenExpires * 1000, // Convert seconds to milliseconds
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
