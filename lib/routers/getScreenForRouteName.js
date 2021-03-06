'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getScreenForRouteName;

var _invariant = require('../utils/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Simple helper that gets a single screen (React component or navigator)
 * out of the navigator config.
 */
function getScreenForRouteName(routeConfigs, routeName) {
  var routeConfig = routeConfigs[routeName];

  if (!routeConfig) {
    throw new Error('There is no route defined for key ' + routeName + '.\n' + ('Must be one of: ' + Object.keys(routeConfigs).map(function (a) {
      return '\'' + a + '\'';
    }).join(',')));
  }

  if (routeConfig.screen) {
    return routeConfig.screen;
  }

  if (typeof routeConfig.getScreen === 'function') {
    var screen = routeConfig.getScreen();
    (0, _invariant2.default)(typeof screen === 'function', 'The getScreen defined for route \'' + routeName + ' didn\'t return a valid ' + 'screen or navigator.\n\n' + 'Please pass it like this:\n' + (routeName + ': {\n  getScreen: () => require(\'./MyScreen\').default\n}'));
    return screen;
  }

  throw new Error('Route ' + routeName + ' must define a screen or a getScreen.');
}