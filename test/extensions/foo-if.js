exports.block = true;

exports.setup = function (binding) {
  var value = typeof binding.source == 'function' ? binding.source() : binding.source;

  if (!value) {
    remove(binding);
  } else {
    binding.added = true;
  }

  return value;
};

exports.update = function (binding, update) {
  if (update && !binding.added) {
    add();
  } else if (binding.added) {
    remove();
  }
};

function add (binding) {
  binding.added = true;
  binding.parent.insertBefore(binding.element, binding.parent.children[binding.index]);
}

function remove (binding) {
  delete binding.added;
  binding.index = Array.prototype.indexOf.call(binding.parent.children, binding.element);
  binding.parent = binding.element.parentNode;
  binding.element.parentNode.removeChild(binding.element);
}
