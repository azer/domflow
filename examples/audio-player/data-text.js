exports.setup = function (binding) {
  binding.element.innerHTML = binding.source();
};

exports.subscribe = function (source, fn) {
  if (typeof source != 'function') return;

  source.subscribe(fn);
}

exports.update = function (binding, update) {
  binding.element.innerHTML = update;
};
