export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error));
    });
  };
};

export const globalErrorHandler = (error, req, res, next) => {
  if (error) {
    return res.json({ message: error.message });
  }
};
