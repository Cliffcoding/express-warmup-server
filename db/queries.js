const knex = require('./knex');
module.exports = {
  getAllUsers(){
    return knex('users');
  },
  createUser(user){
    return knex('users').insert(user, '*');
  },
  getUserByEmail(email){
    return knex('users').where('email', email).first();
  },
  getUserById(id){
    return knex('users').where('id', id).first();
  },
  updateUser(id, item){
    return knex('users').where('id', id).update(item, '*')
  },
  deleteUser(id){
    return knex('users').where('id', id).del();
  }
}
