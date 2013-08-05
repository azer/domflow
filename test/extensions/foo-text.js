exports.setup = function (binding) {
  binding.element.innerHTML = typeof binding.source == 'function' ? binding.source() : binding.source;
};

exports.subscribe = function (source, fn) {
  if (typeof source != 'function') return;

  source.subscribe(fn);
}

exports.update = function (binding, update) {
  binding.element.innerHTML = update;
};
