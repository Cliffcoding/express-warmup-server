const knex = require('./knex');
module.exports = {
  createUser(user){
    return knex('users').insert(user, '*');
  },
  getUserByEmail(email){
    return knex('users').where('email', email).first();
  }
}
