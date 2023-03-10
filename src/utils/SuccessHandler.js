const handleSuccess = (statusCode, apiData, apiMessage, req, res) => {
  const response = {
    success: true,
    errorCode: null,
    message: apiMessage,
    data: apiData,
  };
  return res.status(statusCode).send(response);
};

const handleError = (statusCode, apiMessage, req, res, error) => {
  const response = {
    code: statusCode,
    message: apiMessage,
    stack: error,
  };
  return res.status(statusCode).send(response);
};

module.exports = { handleSuccess, handleError };
