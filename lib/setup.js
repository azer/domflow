var newBinding = require("./binding"),
    elements = require('./elements');

module.exports = setup;

function setup(extensions, target, context){
  typeof target == 'string' && ( target = document.querySelector(target) );

  var isContextArray = Array.isArray(context),
      topElements = elements.top(extensions, target),
      queue = [];

  var ext;
  for (ext in topElements) {
    topElements[ext].forEach(function(el, ind){
      newBinding(isContextArray ? context[ind] : context, ext, extensions[ext], el, ind, later);
    });
  }

  if (queue.length == 0) return;

  var i = -1, len = queue.length;
  while (++i < len) {
    queue[i][0].innerHTML = queue[i][1];
    setup(extensions, queue[i][0], queue[i][2]);
  }

  function later (target, html, subctx) {
    queue.push([target, html, subctx]);
  }
}
