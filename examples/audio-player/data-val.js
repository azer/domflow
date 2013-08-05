exports.setup = function (binding) {
  binding.element.value = binding.source();

  binding.element.addEventListener('change', function(){
    binding.source(binding.element.value);
  }, false);

  binding.element.addEventListener('keyup', function(){
    binding.source(binding.element.value);
  }, false);
};

exports.subscribe = function (source, callback) {
  source.subscribe(callback);
}

exports.update = function (binding, update) {
  binding.element.value = update;
}
