// Load a fake DOM for testing.
import jsdom from 'jsdom';
const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom.jsdom('');
global.window = global.document.defaultView;
global.window.document = { createElement: function () {} };
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});
global.navigator = { userAgent: 'node.js' };
