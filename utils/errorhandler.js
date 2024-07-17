const { INTERNAL_SERVER_ERROR } = require("./Status");

function handleErrorResponse(res, error) {
  const stringError = error.toString();
  return res.status(INTERNAL_SERVER_ERROR).send({ message: stringError });
}

module.exports = { handleErrorResponse };
