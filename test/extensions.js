module.exports = {
  'foo-class': addClass,
  'foo-text': text,
  'foo-iter': iter
};

function iter(target, context, subflow){
  var template = target.innerHTML,
      list = context[ target.getAttribute('foo-iter') ],
      html = target.innerHTML = '';

  var i = -1, len = list.length;
  while (++i < len) {
    html += template;
  }

  subflow(target, html, list);
}

function text(target, context){
  var val = context[target.getAttribute('foo-text')];

  if (typeof val == 'function') {
    val.subscribe(function(newValue){
      target.innerHTML = newValue;
    });

    val = val();
  }

  target.innerHTML =  val;
}

function addClass(target, context){
  var val = context[target.getAttribute('foo-class')];
  if (!val) return;
  target.classList.add(typeof val == 'function' ? val() : val);
}
