var _ = require('lodash');
import CaptainModel from '../models/captain';
import UserModel from '../models/user';

// Searches for captains.
exports.search = function(req, res) {
	// var captain_id = req.body.captain_id;
  var captain_id = req.params.captain_id;
	console.log("friend_finder controller searching for captain: ", captain_id);
	var callback = function(err, captains) {
    //TODO: Clear salt/password from attached user. Maybe do this automatically when we fetch users (is there a way to add auth as an exception to this)?
    if (err) throw err;
    console.log("controller returning captains: ", captains);
    res.json(captains);
	};
  if (captain_id > 0) {
    CaptainModel
      .find({'_unit': captain_id, '_user': {$ne: null}})
      .sort('current_level current_special_level')
      .populate('_user')
      // TODO: we shouldn't do it this way because we'd get a lot of repeated data. Call the unit model separately.
      .populate('_unit')
      .select('current_level current_sockets current_special_level _user _unit')
      .exec(callback);
  } else {
    res.json([]);
  }
};
