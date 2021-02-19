const validate = (req, res, next) => {
  const access = req.header("Access-Token");
  if(!access) res.sendStatus(401);
  else next();
};

module.exports = validate;
