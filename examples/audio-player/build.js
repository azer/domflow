;(function(process){  require.m = { 0:[function(require,module,exports){ var domflow = require('../../'),
    attr = require('attr'),
    bind = domflow({
      'data-play': require('./data-play'),
      'data-val': require('./data-val'),
      'data-text': require('./data-text')
    });

var song = attr('http://tayfabandista.org/daima/player/rasta_semahi.mp3');

bind('body', {
  song: song
});
 },{"../../":23,"./data-play":31,"./data-val":40,"./data-text":41,"attr":42}],23:[function(require,module,exports){ module.exports = require('./lib/with-extensions');
 },{"./lib/with-extensions":24}],31:[function(require,module,exports){ var playAudio = require('play-audio');

exports.setup = function (binding) {
  binding.player = playAudio(binding.source(), binding.element).controls().autoplay();
}

exports.subscribe = function (source, callback) {
  source.subscribe(callback);
}

exports.update = function (binding, update) {
  binding.player.src(update);
}
 },{"play-audio":32}],40:[function(require,module,exports){ exports.setup = function (binding) {
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
 },{}],41:[function(require,module,exports){ exports.setup = function (binding) {
  binding.element.innerHTML = binding.source();
};

exports.subscribe = function (source, fn) {
  if (typeof source != 'function') return;

  source.subscribe(fn);
}

exports.update = function (binding, update) {
  binding.element.innerHTML = update;
};
 },{}],24:[function(require,module,exports){ var setup = require("./setup");

module.exports = withExtensions;

function withExtensions(extensions){
  return function(query, context){
    return setup(extensions, query, context);
  };
}
 },{"./setup":25}],25:[function(require,module,exports){ var newBindings = require("./bindings"),
    newContext = require('./context'),
    elements = require('./elements');

module.exports = setup;

function setup(extensions, target, rawContext){
  typeof target == 'string' && ( target = document.querySelector(target) );

  newBindings(extensions, newContext(rawContext), target, undefined, true);

  /*,
      topElements = elements.top(extensions, target),
      queue = [],
      initialized;

  var ext;
  for (ext in topElements) {
    topElements[ext].forEach(function(el, ind){
      extensions[ext].name = ext;
      newBinding(context.self(ind), extensions[ext], el, later);
    });
  }

  if (queue.length == 0) return;

  var i = -1, len = queue.length;
  while (++i < len) {
    if (queue[i][1]) queue[i][0].innerHTML = queue[i][1];
    setup(extensions, queue[i][0], queue[i][2]);
  }

  initialized = true;

  function later (target, html, subctx) {
    if (initialized) {
      setup(extensions, target, subctx);
    }

    queue.push([target, html, subctx]);
  }*/
}
 },{"./bindings":26,"./context":29,"./elements":30}],26:[function(require,module,exports){ var newBinding = require("./binding"),
    newContext = require('./context'),
    elements   = require('./elements');

module.exports = newBindings;

function newBindings(extensions, context, parent, parentExtension, includeParent){
  var topElements = elements.top(extensions, parent, includeParent),
      deferred = [];

  if (!context.isContext) {
    context = newContext(context);
  }

  var bindings = {
    deferred: deferred,
    initialized: false
  };

  var ext, extName;
  for (extName in topElements) {
    topElements[extName].forEach(function(el, ind){
      extensions[extName].name = extName;
      newBinding(extensions, extName, context.child(ind, parentExtension), el, bindings);
    });
  }

  bindings.initialized = true;

  var i = -1, len = deferred.length;
  while (++i < len) {
    deferred[i]();
  }

  delete deferred;
  delete bindings.deferred;

}
 },{"./binding":27,"./context":29,"./elements":30}],29:[function(require,module,exports){ module.exports = newContext;

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
 },{}],30:[function(require,module,exports){ module.exports = {
  all: all,
  top: top
};


function all(extensions, target, includeTarget){
  typeof target == 'string' && ( target = document.querySelector(target) );

  var elements = {};

  var ext, key;
  for (key in extensions) {
    ext = extensions[key];
    elements[key] = childrenOf(target, key);

    if (includeTarget && target.hasAttribute(key)) {
      Array.prototype.splice.call(elements[key], 0, 0, target);
    }
  }

  return elements;
}

function childrenOf(target, ext){
  return Array.prototype.slice.call(target.querySelectorAll('*[' + ext + ']'));
}

function hasParentBinding(extensions, element){
  var key;
  for (key in extensions) {
    if(extensions[key].block && element.hasAttribute(key)) return true;
  }

  return false;
}

function isTopElement(extensions, target, element){
  if (element == target || element.parentNode == target || !element.parentNode) return true;

  var parent = element.parentNode;

  while (parent) {
    if (hasParentBinding(extensions, parent)) return false;
    parent = parent.parentNode;
  }

  return true;
}

function top(extensions, target, includeTarget){
  var elements = all(extensions, target, includeTarget);

  var ext, i, len;
  for (ext in elements) {
    elements[ext] = Array.prototype.filter.call(elements[ext], function(el){
      return isTopElement(extensions, target, el);
    });
  }

  return elements;
}
 },{}],27:[function(require,module,exports){ var newBindings;

module.exports = newBinding;

function newBinding (extensions, extName, context, el, parent) {
  var input = el.getAttribute(extName),
      ext = extensions[extName];

  var binding = {
    element: el,
    initialized: false,
    source: context.valueOf(extName, el)
  };

  if (ext.subscribe) {
    ext.subscribe(binding.source, binding.updateCallback = function (update) {
      ext.update(binding, update, binding.bindOne);
    });
  }

  binding.html = function (html) {
    if (parent.initialized) {
      return binding.element.innerHTML = html;
    }

    parent.deferred.push(function(){
      binding.element.innerHTML = html;
    });
  };

  binding.setup = function () {
    if (parent.initialized) return binding.bindAll();
    parent.deferred.push(binding.bindAll);
  };

  binding.bindAll = function () {
    newBindings || ( newBindings = require('./bindings') );
    newBindings(extensions, binding.source, el, ext);
  };

  binding.bindOne = function (el, context) {
    newBindings || ( newBindings = require('./bindings') );

    newBindings(extensions, context, el, ext, true);
  };

  ext.setup(binding);

  return binding;
}
 },{"./bindings":26}],42:[function(require,module,exports){ var pubsub = require("pubsub"),
    prop   = require("property");

module.exports        = attr;
module.exports.attrs  = attrs;
module.exports.all    = attrs;
module.exports.object = attrs;

function attr(){
  var obj = pubsub(prop.apply(null, arguments).extend(function(raw){

    return function(newValue){
      var oldValue = raw(),
          ret      = raw.apply(undefined, arguments);

      if(arguments.length && oldValue != ret ){
        obj.publish(ret, oldValue);
      }

      return ret;
    };

  }));

  return obj;
}

function attrs(raw, exceptions){
  var obj = {}, key, val;

  for(key in raw){
    val = raw[key];
    obj[key] = ( ! Array.isArray(exceptions) || exceptions.indexOf(key) == -1 )
      && ( typeof val != 'object' || !val || val.constructor != Object )
      && ( typeof val != 'function' )
      ? attr(val)
      : val;
  }

  return obj;
}
 },{"pubsub":43,"property":44}],43:[function(require,module,exports){ module.exports = PubSub;

function PubSub(mix){

  var proxy = mix || function pubsubProxy(){
    arguments.length && sub.apply(undefined, arguments);
  };

  function sub(callback){
    subscribe(proxy, callback);
  }

  function subOnce(callback){
    once(proxy, callback);
  }

  function unsubOnce(callback){
    unsubscribeOnce(proxy, callback);
  }

  function unsub(callback){
    unsubscribe(proxy, callback);
  }

  function pub(){
    var args = [proxy];
    Array.prototype.push.apply(args, arguments);
    publish.apply(undefined, args);
  }

  proxy.subscribers        = [];
  proxy.subscribersForOnce = [];

  proxy.subscribe          = sub;
  proxy.subscribe.once     = subOnce;
  proxy.unsubscribe        = unsub;
  proxy.unsubscribe.once   = unsubOnce;
  proxy.publish            = pub;

  return proxy;
}

/**
 * Publish "from" by applying given args
 *
 * @param {Function} from
 * @param {...Any} args
 */
function publish(from){

  var args = Array.prototype.slice.call(arguments, 1);

  if (from && from.subscribers && from.subscribers.length > 0) {
    from.subscribers.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });
  }

  if (from && from.subscribersForOnce && from.subscribersForOnce.length > 0) {
    from.subscribersForOnce.forEach(function(cb, i){
      if(!cb) return;

      try {
        cb.apply(undefined, args);
      } catch(exc) {
        setTimeout(function(){ throw exc; }, 0);
      }
    });

    from.subscribersForOnce = [];

  }

}

/**
 * Subscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function subscribe(to, callback){
  if(!callback) return false;
  return to.subscribers.push(callback);
}


/**
 * Subscribe callback to given pubsub object for only one publish.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function once(to, callback){
  if(!callback) return false;

  return to.subscribersForOnce.push(callback);
}

/**
 * Unsubscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function unsubscribe(to, callback){
  var i = to.subscribers.length;

  while(i--){
    if(to.subscribers[i] && to.subscribers[i] == callback){
      to.subscribers[i] = undefined;

      return i;
    }
  }

  return false;
}


/**
 * Unsubscribe callback subscribed for once to specified pubsub.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 * @return {Boolean or Number}
 */
function unsubscribeOnce(to, callback){
  var i = to.subscribersForOnce.length;

  while(i--){
    if(to.subscribersForOnce[i] && to.subscribersForOnce[i] == callback){
      to.subscribersForOnce[i] = undefined;

      return i;
    }
  }

  return false;
}
 },{}],44:[function(require,module,exports){ module.exports = prop;

/**
 * Create and return a new property.
 *
 * @param {Anything} rawValue (optional)
 * @param {Function} getter (optional)
 * @param {Function} setter (optional)
 * @return {AdaProperty}
 */
function prop(rawValue, getter, setter){

  var raw = (function(value){

    return function raw(update){
      if( arguments.length ){
        value = update;
      }

      return value;
    };

  }());

  function proxy(update, options){
    if(arguments.length > 0){
      raw( setter ? setter(update, raw()) : update );
    }

    return getter ? getter(raw()) : raw();
  };

  proxy.extend = function(ext){
    raw = ext(raw);
    return proxy;
  }

  proxy.getter = function(newGetter){
    getter = newGetter;
    return proxy;
  };

  proxy.setter = function(newSetter){
    setter = newSetter;
    return proxy;
  };

  proxy.isAdaProperty = true;
  proxy.raw           = raw;

  raw(setter ? setter(rawValue) : rawValue);

  return proxy;
}
 },{}],32:[function(require,module,exports){ module.exports = require('./lib/player');
 },{"./lib/player":33}],33:[function(require,module,exports){ var newChain  = require('new-chain'),
    src = require('./src'),
    render = require('./render');

module.exports = play;

function play(urls, dom){
  var el, chain, url;

  dom || ( dom = document.documentElement );
  el = render();
  dom.appendChild(el);

  chain = newChain({
    autoplay: bool('autoplay'),
    controls: bool('controls'),
    load: method('load'),
    loop: bool('loop'),
    muted: bool('muted'),
    on: on,
    pause: method('pause'),
    play: method('play'),
    preload: bool('preload')
  });

  chain.currentTime = attr('currentTime');
  chain.element = element;
  chain.src = src.attr(el);
  chain.volume = attr('volume');
  chain.remove = remove;

  chain.src(urls);

  return chain;

  function attr(name){
    return function(value){
      if ( arguments.length ) {
        el[name] = value;
        return chain;
      }

      return el[name];
    };
  }

  function bool(name){
    return function(value){
      if (value === false) {
        return el[name] = false;
      }

      return el[name] = true;
    };
  }

  function element(){
    return el;
  }

  function on(event, callback){
    el.addEventListener(event, callback, false);
  }

  function method(name){
    return function(){
      return el[name].apply(el, arguments);
    };
  }

  function remove(){
    return el.parentNode.removeChild(el);
  }

}
 },{"./src":34,"./render":36,"new-chain":39}],34:[function(require,module,exports){ var mimeOf = require("./mime");

module.exports = {
  attr: attr,
  pick: pick
};

function attr(el){
  var value;

  return function(urls){
    if (arguments.length) {
      value = urls;
      el.setAttribute('src', pick(el, value));
    }

    return value;
  };
}

function pick(el, urls){
  if(!urls) return;

  if(typeof urls == 'string'){
    return urls;
  }

  return urls.filter(function(url){
    return !!el.canPlayType(mimeOf(url));
  })[0];
}
 },{"./mime":35}],36:[function(require,module,exports){ var domify = require('domify'),
    templates = require("./templates");

module.exports = render;

function render(src){
  return domify(templates['audio.html']);
}
 },{"./templates":37,"domify":38}],37:[function(require,module,exports){ exports["audio.html"] = "<audio preload=\"auto\" /></audio>" },{}],35:[function(require,module,exports){ var table = {
  aif  : "audio/x-aiff",
  aiff : "audio/x-aiff",
  wav  : "audio/x-wav",
  mp3  : 'audio/mpeg',
  m3u  : "audio/x-mpegurl",
  mid  : "audio/midi",
  midi : "audio/midi",
  m4a  : 'audio/m4a',
  ogg  : 'audio/ogg'
};

module.exports = mimeOf;

function mimeOf(url){
  return table[ url.split('.').slice(-1)[0] ];
}
 },{}],39:[function(require,module,exports){ module.exports = newChain;
module.exports.from = from;

function from(chain){

  return function(){
    var m, i;

    m = methods.apply(undefined, arguments);
    i   = m.length;

    while ( i -- ) {
      chain[ m[i].name ] = m[i].fn;
    }

    m.forEach(function(method){
      chain[ method.name ] = function(){
        method.fn.apply(this, arguments);
        return chain;
      };
    });

    return chain;
  };

}

function methods(){
  var all, el, i, len, result, key;

  all    = Array.prototype.slice.call(arguments);
  result = [];
  i      = all.length;

  while ( i -- ) {
    el = all[i];

    if ( typeof el == 'function' ) {
      result.push({ name: el.name, fn: el });
      continue;
    }

    if ( typeof el != 'object' ) continue;

    for ( key in el ) {
      result.push({ name: key, fn: el[key] });
    }
  }

  return result;
}

function newChain(){
  return from({}).apply(undefined, arguments);
}
 },{}],38:[function(require,module,exports){ 
/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}
 },{}] }; function require(o){ if(o[2]) return o[2].exports; o[0](function(u){ if(!require.m[o[1][u]]) { throw new Error('Cannot find module "' + u + '"'); } return require(require.m[o[1][u]]); }, o[2] = { exports: {} }, o[2].exports); return o[2].exports; };  return require(require.m[0]); }({ env:{} }));