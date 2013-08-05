var domify = require('domify');

exports.block = true;

exports.child = function (source, index) {
  return typeof source == 'function' ? source(index) : source[index];
};

exports.isIterable = function (source) {
  return Array.isArray(source) || (typeof source == 'function' && Array.isArray(source()) );
};

exports.setup = function (binding) {
  var source = typeof binding.source == 'function' ? binding.source() : binding.source,
      html;

  binding.template = binding.element.innerHTML;
  binding.element.innerHTML = '';

  html = copy(binding.template, source.length);
  binding.html(html);
  binding.setup();
};

exports.subscribe = function (source, fn) {
  if (source.subscribe) source.subscribe(fn);
};

exports.update = function (binding, update, bind) {
  var i, el;
  if (update.add) {
    for (i in update.add) {
      el = domify(binding.template);
      binding.element.insertBefore(el, binding.element.children[i]);
      bind(el, update.add[i]);
    }
  }

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
