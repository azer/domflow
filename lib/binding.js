var newBindings;

module.exports = newBinding;

function newBinding (extensions, extName, context, el, parent) {
  var input = el.getAttribute(extName),
      ext = extensions[extName];

  var binding = {
    element: el,
    initialized: false,
    source: context.valueOf(extName, el)
  };

  if (ext.subscribe) {
    ext.subscribe(binding.source, binding.updateCallback = function (update) {
      ext.update(binding, update, binding.bindOne);
    });
  }

  binding.html = function (html) {
    if (parent.initialized) {
      return binding.element.innerHTML = html;
    }

    parent.deferred.push(function(){
      binding.element.innerHTML = html;
    });
  };

  binding.setup = function () {
    if (parent.initialized) return binding.bindAll();
    parent.deferred.push(binding.bindAll);
  };

  binding.bindAll = function () {
    newBindings || ( newBindings = require('./bindings') );
    newBindings(extensions, binding.source, el, ext);
  };

  binding.bindOne = function (el, context) {
    newBindings || ( newBindings = require('./bindings') );

    newBindings(extensions, context, el, ext, true);
  };

  ext.setup(binding);

  return binding;
}
