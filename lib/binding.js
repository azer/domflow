module.exports = newBinding;

function newBinding (context, key, ext, el, ind, subflow){
  var input = el.getAttribute(key);

  var binding = {
    element: el,
    index: ind,
    source: input == '.' ? context : context[input]
  };

  ext.setup(binding, subflow);

  if (ext.update && binding.source.subscribe) {
    binding.source.subscribe(binding.updateCallback = function(update, previous){
      ext.update(binding, update, previous);
    });
  }

  return binding;
}
