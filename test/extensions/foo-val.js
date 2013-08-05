exports.setup = function (binding) {
  binding.element.value = binding.source();

  binding.element.addEventListener('change', function(){
    binding.source(binding.element.value);
  }, false);
};

exports.update = function (binding, update) {
  binding.element.value = update;
}
