module.exports = bind;

function bind(extensions, target, context){
  typeof target == 'string' && ( target = document.querySelector(target) );

  var isContextArray = Array.isArray(context),
      queue = [];

  var ext, fn, matching;
  for (ext in extensions) {
    fn = extensions[ext];

    matching = childrenOf(target, ext);

    if (!fn) return;

    var toAppend;
    matching.forEach(function(el, ind){
      fn(el, isContextArray ? context[ind] : context, function(target, html, subctx){
        queue.push([target, html, subctx]);
      });
    });
  }

  if (queue.length == 0) return;

  var i = -1, len = queue.length;
  while (++i < len) {
    queue[i][0].innerHTML = queue[i][1];
    bind(extensions, queue[i][0], queue[i][2]);
  }

}

function childrenOf(target, ext){
  return Array.prototype.slice.call(target.querySelectorAll('*[' + ext + ']'));
}
