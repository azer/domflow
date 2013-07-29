// FIXME This module won't be fast

module.exports = {
  all: all,
  top: top
};


function all(extensions, target){
  typeof target == 'string' && ( target = document.querySelector(target) );

  var elements = {};

  var ext, key;
  for (key in extensions) {
    ext = extensions[key];
    elements[key] = childrenOf(target, key);
  }

  return elements;
}

function childrenOf(target, ext){
  return target.querySelectorAll('*[' + ext + ']');
}

function hasParentBinding(extensions, element){
  var key;
  for (key in extensions) {
    if(extensions[key].block && element.hasAttribute(key)) return true;
  }

  return false;
}

function isTopElement(extensions, target, element){
  if (element == target || element.parentNode == target || !element.parentNode) return true;

  var parent = element.parentNode;

  while (parent) {
    if (hasParentBinding(extensions, parent)) return false;
    parent = parent.parentNode;
  }

  return true;
}

function top(extensions, target){
  var elements = all(extensions, target);

  var ext, i, len;
  for (ext in elements) {
    elements[ext] = Array.prototype.filter.call(elements[ext], function(el){
      return isTopElement(extensions, target, el);
    });
  }

  return elements;
}
