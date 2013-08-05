var newBindings = require("./bindings"),
    newContext = require('./context'),
    elements = require('./elements');

module.exports = setup;

function setup(extensions, target, rawContext){
  typeof target == 'string' && ( target = document.querySelector(target) );

  newBindings(extensions, newContext(rawContext), target, undefined, true);
}
