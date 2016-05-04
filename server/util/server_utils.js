import glob from 'glob';
const _ = require('lodash');

/* istanbul ignore next */
/* This was inspired from https://github.com/caljrimmer/isomorphic-redux-app/blob/73e6e7d43ccd41e2eb557a70be79cebc494ee54b/src/common/api/fetchComponentDataBeforeRender.js */
export function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce((prev, current) => {
    return (current.need || [])
      .concat((current.WrappedComponent && (current.WrappedComponent.need !== current.need) ? current.WrappedComponent.need : []) || [])
      .concat(prev);
  }, []);
  const promises = needs.map(need => dispatch(need(params)));
  return Promise.all(promises);
}

export function getGlobbedFiles(globPatterns) {
  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedFiles(globPattern));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob(globPatterns, { sync: true });
      output = _.union(output, files);
    }
  }
  return output;
}
