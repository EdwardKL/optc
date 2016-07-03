import UnitModel from '../models/unit';

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

exports.fetchIds = function fetch_ids(req, res, next) {
  UnitModel
    .find({})
    .sort('_id')
    .select('_id')
    .exec((err, docs) => {
      // In case of any error return nothing.
      if (err || !docs) {
        res.json({});
      } else {
        console.log('returning ids');
        res.json(docs.map((doc) => {
          return doc._id;
        }));
      }
      next();
      return;
    });
};

exports.fetch = function fetch_unit(req, res, next) {
  const id = req.params.id;
  UnitModel.findById(id, (err, unit) => {
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
