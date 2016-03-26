var _ = require('lodash');
import Captain from '../models/captain';

// Searches for captains.
exports.search = function(req, res) {
	var captain_id = req.body.captain_id;
	console.log("Searching for captain: ", captain_id);
	var callback = function(err, captains) {
		res.json(captains);
	};
	Captain
		.find({ 'unit_id': captain_id })
		.sort('current_level current_special_level')
		.select('current_level current_sockets current_special_level user_id')
		.exec(callback);
};