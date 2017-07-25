const jwt = require('jsonwebtoken');

require('dotenv').config();

function ensureLoggedIn(req,res,next){
  const authHeader = req.get('Authorization');
  const token = authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if(!err) return next();
      res.json(401);
      next(new Error('Invalid Token'))
    });
  } else {
    res.status(401);
    next(new Error('Not-Authorized'));
  }
}
module.exports = {
  ensureLoggedIn
}
