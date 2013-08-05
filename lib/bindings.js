var newBinding = require("./binding"),
    newContext = require('./context'),
    elements   = require('./elements');

module.exports = newBindings;

function newBindings(extensions, context, parent, parentExtension, includeParent){
  var topElements = elements.top(extensions, parent, includeParent),
      deferred = [];

  if (!context.isContext) {
    context = newContext(context);
  }

  var bindings = {
    deferred: deferred,
    initialized: false
  };

  var ext, extName;
  for (extName in topElements) {
    topElements[extName].forEach(function(el, ind){
      extensions[extName].name = extName;
      newBinding(extensions, extName, context.child(ind, parentExtension), el, bindings);
    });
  }

  bindings.initialized = true;

  var i = -1, len = deferred.length;
  while (++i < len) {
    deferred[i]();
  }

  delete deferred;
  delete bindings.deferred;

}
