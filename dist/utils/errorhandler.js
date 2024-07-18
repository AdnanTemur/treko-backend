"use strict";

var _require = require("./Status"),
  INTERNAL_SERVER_ERROR = _require.INTERNAL_SERVER_ERROR;
function handleErrorResponse(res, error) {
  var stringError = error.toString();
  return res.status(INTERNAL_SERVER_ERROR).send({
    message: stringError
  });
}
module.exports = {
  handleErrorResponse: handleErrorResponse
};