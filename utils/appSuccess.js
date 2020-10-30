const appSuccess = (data, message) => {
  return {
    status: 'success',
    message: message,
    data: data,
  };
};
exports.appSuccess = appSuccess;
