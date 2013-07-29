exports.setup = function(binding){
  var val = typeof binding.source == 'function' ? binding.source() : binding.source;

  if (!val) return;

  binding.element.classList.add(val);
};
