module.exports = newContext;

function newContext(from, parent){
  var ctx = { isContext: true };

  ctx.content = from;
  ctx.parent = parent;

  ctx.at = function (ind) {
    return ctx.content[ind];
  };

  ctx.child = function (ind, ext) {
    if (ext == undefined && Array.isArray(ctx.content)) {
      return newContext(ctx.content[ind], ctx);
    }

    if ( !ext || !ext.isIterable || !ext.isIterable(ctx.content) ) return ctx;

    if (ext && ext.child) return newContext(ext.child(ctx.content, ind));

    return newContext(ctx.content[ind], ctx);
  };

  ctx.valueOf = function (extName, el){
    var input = el.getAttribute(extName);

    if (input == '.') {
      return ctx.content;
    }

    return ctx.content[input] || ( ctx.parent && ctx.parent.valueOf(extName, el) );
  };

  return ctx;
}
