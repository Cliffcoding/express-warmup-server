const queries = require('../db/queries');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const valid = require('./validate');
const authMiddleware = require('../auth/middleware');

const router = express.Router();

router.get('/users', (req,res,next) => {
  queries.getAllUsers().then(users => {
    res.json(users);
  });
});

router.get('/users/:id', (req,res,next) => {
  queries.getUserById(req.params.id).then(user => {
    res.json(user)
  })
})
router.delete('/users/:id', (req,res,next) => {
  queries.deleteUser(req.params.id).then(deleted => {
    res.json(deleted);
  })
})
router.put('/users/:id', (req,res,next) => {
  queries.getUserById(req.params.id).then(user => {
    bcrypt.hash(req.body.password, 8)
     .then((hash) => {
       let user = {
         email: req.body.email,
         password:hash
       };
      queries.updateUser(req.params.id, user).then(user => {
        res.json(user);
      });
      });
    })
});

router.post('/auth/login', (req,res,next) => {
  if(valid.user(req.body)){
    queries.getUserByEmail(req.body.email).then(user => {
      if(user) {
        bcrypt.compare(req.body.password, user.password).then(result => {
          if(result) {
            jwt.sign({id: user.id}, process.env.TOKEN_SECRET, (err, token) => {
              res.json({
                token,
                id: user.id
              });
            });
          } else {
            next(new Error('Invalid Password'));
          }
        });
      } else {
        next(new Error('Invalid Email'));
      }
    });
  } else {
    next(new Error('Email is in use'));
  }
});
router.post('/users', (req,res,next) => {
  if (valid.user(req.body)) {
    queries.getUserByEmail(req.body.email).then(user => {
      if (!user) {
         bcrypt.hash(req.body.password, 8)
          .then((hash) => {
            let user = {
              email: req.body.email,
              password:hash
            };
            queries.createUser(user).then(user => {
              res.json({
                message: 'Success',
                user
              });
            });
          });
      } else {
        next(new Error('Email is use'));
      }
    });
  } else {
    next(new Error('Invalid Password'))
  }
})
module.exports = router;
