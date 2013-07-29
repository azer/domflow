exports.setup = function(binding){
  binding.element.innerHTML = typeof binding.source == 'function' ? binding.source() : binding.source;
};

exports.update = function(binding, update){
  binding.element.innerHTML = update;
};
