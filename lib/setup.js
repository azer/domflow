var newBindings = require("./bindings"),
    newContext = require('./context'),
    elements = require('./elements');

module.exports = setup;

function setup(extensions, target, rawContext){
  typeof target == 'string' && ( target = document.querySelector(target) );

  newBindings(extensions, newContext(rawContext), target, undefined, true);

  /*,
      topElements = elements.top(extensions, target),
      queue = [],
      initialized;

  var ext;
  for (ext in topElements) {
    topElements[ext].forEach(function(el, ind){
      extensions[ext].name = ext;
      newBinding(context.self(ind), extensions[ext], el, later);
    });
  }

  if (queue.length == 0) return;

  var i = -1, len = queue.length;
  while (++i < len) {
    if (queue[i][1]) queue[i][0].innerHTML = queue[i][1];
    setup(extensions, queue[i][0], queue[i][2]);
  }

  initialized = true;

  function later (target, html, subctx) {
    if (initialized) {
      setup(extensions, target, subctx);
    }

    queue.push([target, html, subctx]);
  }*/
}
