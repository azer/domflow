var domify = require('domify');

exports.block = true;

exports.setup = function(binding, subflow){
  var source = typeof binding.source == 'function' ? binding.source() : binding.source,
      html;

  binding.template = binding.element.innerHTML;
  binding.element.innerHTML = '';

  html = copy(binding.template, source.length);
  subflow(binding.element, html, source);
};

exports.update = function(binding, update, subflow){

  var i, el;
  if (update.add) {
    for (i in update.add) {
      el = domify(binding.template);
      binding.element.insertBefore(el, binding.element.children[i]);
    }
  }

  /*if (update.add) {
    debugger;
    toAdd = domify(copy(binding.template, update.add.length));

    i = -1;
    len = toAdd.length;

    while (++i < len) {
      binding.element.appendChild(toAdd[i]);
    }
  }*/

  if (update.remove) {
    i = update.remove.length;

    while (i --> 0) {
      binding.element.removeChild(binding.element.children[i]);
    }
  }
}

function copy (template, len) {
  var i = -1, html = '';

  while (++i < len) {
    html += template;
  }

  return html;
}
