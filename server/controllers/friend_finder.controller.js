import CaptainModel from '../models/captain';
import { getNumber } from './utils';
require('../models/unit');
require('../models/user');

// Searches for captains.
exports.search = function search(req, res, next) {
  const captain_id = getNumber(req.params.captain_id);
  const region = req.query.region;
  console.log('friend_finder controller searching for captain: ', captain_id, ' with region: ', region);
  if (captain_id <= 0) {
    res.json([]);
    next();
    return;
  }

  CaptainModel
    .find({ _unit: captain_id, _user: { $ne: null } })
    .sort('current_level current_special_level')
    .populate('_user')
    .populate({
      path: '_user',
      populate: {
        path: '_accounts',
        model: 'Account',
        match: { region : region },
        populate: {
          path: '_captains',
          model: 'Captain'
      }}})
    // TODO: we shouldn't do it this way because we'd get a lot of repeated data. Call the unit model separately.
    .populate('_unit')
    .select('current_level current_sockets current_special_level current_hp_ccs current_atk_ccs current_rcv_ccs _user _unit')
    .exec((err, captains) => {
      if (err) throw err;
      console.log("friend_finder controller returning captains: ", captains);
      captains.map((captain) => {
        if (captain._user) {
          captain._user.clearSensitiveData();
        }
      });
      res.json(captains);
      next();
    });
};
