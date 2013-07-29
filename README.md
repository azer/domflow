## domflow

Lightweight Reactive DOM Programming Library. It only provides an API for your own
data-binding abstractions.

## The Protocol

* Domflow accepts any type, including functions as data.
* One-way binding will be initialized if given function has `subscribe` method.
* If given function has `subscribe` and `publish` methods, domflow will initialize a two-way binding.

## Install

```bash
$ npm install domflow
```

## Example Usage

```html
<div>
  <label foo-text="title"></label>
  <textarea foo-value="input">
  </textarea>
</div>
```

```js
domflow = require('domflow')
attrs = require('attrs') // you can use any other event/model library instead of attrs

foo = domflow({
  'foo-text': require('./foo-text'), // see below for implementation
  'foo-value': require('./foo-value')
})

foo('div', attrs({
  caption: 'hello. tell us about your self:',
  input: 'type here'
}))
```

## Example Implementation

foo-text.js
```js
exports.update = function(element, update) {
  element.innerHTML = update;
}

exports.setup = function (element, value) {
  element.innerHTML = value();
}
```

foo-value.js

```js
exports.update = function (element, update) {
  element.innerHTML = update;
}

exports.setup = function (element, source) {
  element.innerHTML = source();

  element.onchange = function(){
    source(element.value);
  }
}
```

See `test/extension.js` and `test/index.js` for more examples.
