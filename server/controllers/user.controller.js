import User from '../models/user';

export function getUsers(req, res) {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ users });
  });
}
