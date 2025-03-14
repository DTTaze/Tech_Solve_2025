const responseFormatter = (req, res, next) => {
  res.warn = () => {
    console.log("test res warn");
  };
  res.success = (message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
      status: statusCode,
      success: true,
      message,
      ...(data && { data }),
    });
  };

  res.error = (statusCode, message, error = null) => {
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
