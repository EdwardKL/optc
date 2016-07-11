import UnitModel from '../models/unit';
import RecommendationModel from '../models/recommendation';
import RECOMMENDATION from '../../constants/recommendation';
import { redirectIfLoggedOut } from './utils';

/* For internal uses only.
exports.getAll = function (req, res) {
  console.log('getting all units');
  var callback = function (err, units) {
    // In case of any error return
    if (err) {
      console.log('Error retrieving units: ' + err);
      req.flash('error_message', 'There was an error. Please contact the owner.');
      res.redirect('/');
      return;
    }
    // Found units
    if (units) {
      res.json({ units: units });
    } else {
      console.log('Could not find any units!');
      req.flash('error_message', 'For some reason this website thinks there are no units in the game. Please contact the owner.');
      res.redirect('/');
      return;
    }
  };
  UnitModel
    .find({})
    .sort('_id')
    .populate('special_ability')
    .select('slots name max_level special_ability')
    .exec(callback);
};*/

exports.fetchIdAndNames = function fetch_id_and_names(req, res, next) {
  UnitModel
    .find({})
    .sort('_id')
    .select('_id name')
    .exec((err, docs) => {
      // In case of any error return nothing.
      if (err || !docs) {
        res.json([{}]);
      } else {
        res.json(docs.map((doc) => {
          return { id: doc._id, name: doc.name };
        }));
      }
      next();
      return;
    });
};

exports.fetch = function fetch_unit(req, res, next) {
  const id = req.params.id;
  UnitModel
    .findById(id)
    .populate('special_ability')
    .exec((err, unit) => {
      // In case of any error return nothing.
      if (err || !unit) {
        res.json({});
      } else {
        res.json(unit);
      }
      next();
      return;
    });
};

exports.recommend = function recommend(req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  const id = req.params.id;
  const recommended = req.params.recommended === '1';
  const recommendation = { _user: req.user._id, _unit: id };
  const redirection = `/unit/${id}`;
  RecommendationModel
    .findOne(recommendation)
    .exec((err, doc) => {
      if (doc) {
        // If the user already had set this value before, we should remove it (i.e. toggle).
        if (doc.recommended === recommended) {
          doc.remove((e1, removed) => {
            if (e1) throw e1;
            res.redirect(redirection);
            next();
            return;
          });
          return;
        }
        // Otherwise just replace the value.
        doc.recommended = recommended;
        doc.save((e1, saved) => {
          if (e1) throw e1;
          res.redirect(redirection);
          next();
          return;
        });
        return;
      }
      const new_recommendation = new RecommendationModel({
        ...recommendation,
        recommended,
      });
      new_recommendation.save((save_err) => {
        if (save_err) {
          req.flash('error_message', 'There was an error saving this recommendation. Try again later.');
          res.redirect(redirection);
          next();
          return;
        }
        res.redirect(redirection);
        next();
        return;
      });
    });
};

exports.fetchGlobalRecommendations = function fetch_global_recommendations(req, res, next) {
  const id = req.params.id;
  RecommendationModel
    .find({ _unit: id })
    .exec((err, docs) => {
      let recommended = 0;
      let not_recommended = 0;

      if (!err && docs) {
        docs.map((doc) => {
          if (doc.recommended) {
            recommended += 1;
          } else {
            not_recommended += 1;
          }
        });
      }
      res.json({ recommended, not_recommended });
      next();
      return;
    });
};

exports.fetchRecommendation = function fetch_recommendation(req, res, next) {
  const user_id = req.params.user_id;
  if (!user_id || user_id === 'null') {
    res.json(RECOMMENDATION.UNABLE);
    next();
    return;
  }
  const id = req.params.id;
  RecommendationModel
    .findOne({ _user: user_id, _unit: id })
    .exec((err, doc) => {
      if (!err && doc) {
        res.json(doc.recommended ? RECOMMENDATION.POSITIVE : RECOMMENDATION.NEGATIVE);
      } else {
        res.json(RECOMMENDATION.NONE);
      }
      next();
      return;
    });
};
