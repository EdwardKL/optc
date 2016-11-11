import CaptainModel from '../models/captain';
import { getNumber } from './utils';
import { FRIEND_FINDER_RESULTS_PAGE_SIZE } from '../../constants/common';
require('../models/unit');
require('../models/user');

// Searches for captains.
exports.search = function search(req, res, next) {
  const captain_id = getNumber(req.params.captain_id);
  const region = req.query.region;
  const page = getNumber(req.query.page);
  console.log('friend_finder controller searching for captain: ', captain_id, ' with region: ', region);
  console.log('and page: ', page);
  if (captain_id <= 0) {
    res.json([]);
    next();
    return;
  }

  CaptainModel
    .find({ _unit: captain_id })
    .where('region', region)
    .sort('-current_level -current_special_level')
    .populate('_user')
    .populate('_account')
    .populate({
      path: '_account',
      populate: {
        path: '_captains',
        model: 'Captain'
      },
    })
    // TODO: we shouldn't do it this way because we'd get a lot of repeated data. Call the unit model separately.
    .populate('_unit')
    .select('current_level current_sockets current_special_level current_hp_ccs current_atk_ccs current_rcv_ccs _user _unit _account region')
    .limit(FRIEND_FINDER_RESULTS_PAGE_SIZE)
    .skip(FRIEND_FINDER_RESULTS_PAGE_SIZE * (page - 1))
    .exec((err, captains) => {
      if (err) throw err;
      captains.map((captain) => {
        if (captain._user) {
          captain._user.clearSensitiveData();
        }
      });
      console.log('captains found: ', captains);
      res.json(captains);
      next();
    });
};

// Fetches the number of pages for a search result for a given captain.
exports.fetchNumPages = function search(req, res, next) {
  const captain_id = getNumber(req.params.captain_id);
  const region = req.query.region;

  CaptainModel
    .find({ _unit: captain_id })
    // dont think these populates are even needed
    .populate('_user')
    .populate('_account')
    .populate({
      path: '_account',
      populate: {
        path: '_captains',
        model: 'Captain'
      }
    })
    .count({})
    .exec((err, total) => {
      console.log("friend_finder controller fetched num results: ", total);
      res.json(Math.ceil(total / FRIEND_FINDER_RESULTS_PAGE_SIZE));
      next();
    });
};
