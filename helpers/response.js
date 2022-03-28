module.exports = (res, status, sucess, message, results) => {
  res.status(status).json({
    sucess,
    message,
    status,
    results,
  });
};
