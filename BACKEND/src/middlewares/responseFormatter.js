const responseFormatter = (req, res, next) => {
  res.success = (message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
      status: statusCode,
      success: true,
      message,
      ...(data && { data }),
    });
  };

  res.error = ( message, error = null,statusCode = 500) => {
    res.status(statusCode).json({
      status: statusCode,
      success: false,
      message,
      ...(error && { error }),
    });
  };

  next();
};

export default responseFormatter;
