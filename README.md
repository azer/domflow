## domflow

Lightweight Reactive DOM Programming Library. It only provides an API for your own
data-binding abstractions.

## The Binding Protocol

* Domflow expects data as functions.
* One-way binding will be initialized if given function has `subscribe` method that distributes updates to callbacks. 
* Two-way binding will be initialized if given function sets its value if first parameter was specified.

Example data:

```js
> mood()
'sleepy'
> mood.subscribe(function(newMood) { console.log('mood =>', newMood) })
> mood('happy')
'happy'
'mood => happy'
```

## Example Data Structures

* [attr](http://github.com/azer/attr)
* [new-list](http://github.com/azer/new-list)
* [new-object](http://github.com/azer/new-object)

## Extensions

see `test/extensions` or below examples

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
exports.update = function(binding, update) {
  binding.element.innerHTML = update; // the update distributed to sub
}

exports.setup = function (binding) {
  binding.innerHTML = source(); // the function that holds the data
}
```

foo-value.js

```js
exports.update = function (binding, update) {
  element.innerHTML = update;
}

exports.setup = function (binding, source) {
  binding.element.innerHTML = source();

  binding.element.onchange = function(){
    source(element.value);
  }
}
```

See `test/extension.js` and `test/index.js` for more examples.
