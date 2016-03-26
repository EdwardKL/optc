var _ = require('lodash');
import CaptainModel from '../models/captain';
import UserModel from '../models/user';

// Searches for captains.
exports.search = function(req, res) {
	var captain_id = req.body.captain_id;
	console.log("Searching for captain: ", captain_id);
	var callback = function(err, captains) {
		res.json(captains);
	};
	CaptainModel
		.find({ '_unit': captain_id })
		.sort('current_level current_special_level')
		.populate('_user')
		// TODO: we shouldn't do it this way because we'd get a lot of repeated data. Call the unit model separately.
		.populate('_unit')
		.select('current_level current_sockets current_special_level _user _unit')
		.exec(callback);
};