const handleSuccess = (statusCode, apiData, apiMessage, req, res) => {
  const response = {
    success: true,
    errorCode: null,
    message: apiMessage,
    data: apiData,
  };
  return res.status(statusCode).send(response);
};

module.exports = handleSuccess;
