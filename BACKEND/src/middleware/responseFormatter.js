const responseFormatter = (req, res, next) => {
  res.warn = () => {
    console.log("test res warn");
  };
  res.success = (message, data = null) => {
    res.status(200).json({
      status: 200,
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
