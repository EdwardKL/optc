var _ = require('lodash');
import User from '../models/user';

//export function getUsers(req, res) {
//  User.find().exec((err, users) => {
//    if (err) {
//      return res.status(500).send(err);
//    }
//    res.json({ users });
//  });
//}

module.exports = _.extend(
  require('./users/users.authentication.controller')
);
