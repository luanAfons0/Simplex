export const ResponseDecorator = (req, res, next) => {
  res.status = (status) => {
    res.statusCode = status;
    return res;
  };
  res.json = (data) => {
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(data));
  };
  res.send = async (data) => {
    res.end(data);
  };

  next();
};
