const doctorMiddleware = (
  req,
  res,
  next
) => {

  try {

    if (
      req.user.role !== "doctor"
    ) {
      return res.status(403).json({
        msg: "Doctor access only"
      });
    }

    next();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      msg: "Authorization failed"
    });
  }
};

export default doctorMiddleware;