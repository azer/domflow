## domflow

Lightweight Reactive DOM Programming Library. It only provides an API for your own
data-binding abstractions.

## Install

```bash
$ npm install domflow
```

## Example Usage

```html
<div>
  <label foo-text="title"></label>
  <textarea foo-value="">
  </textarea>
</div>
```

```js
domflow = require('domflow')
attrs = require('attrs') // you can use any other event/model library instead of attrs

foo = domflow({
  'foo-text': fooText, // see below for implementation
  'foo-value': fooValue
})

foo('div', attrs({
  caption: 'hello. tell us about your self:',
  input: 'type here'
}))
```

## Example Implementation

`foo-text`

```js
function fooText(element, context){
  text = context[ element.getAttribute('foo-text') ]

  element.innerHTML = text

  text.subscribe(function(update){
    element.innerHTML = update
  })
}
```

`foo-value`

```js
function fooValue(element, context){
  value = context[ element.getAttribute('foo-text') ]

  element.value = value

  value.subscribe(function(update){
    element.innerHTML = update
  })

  element.onkeyup = function(){
    value(element.value)
  }
}
```

See `test/extension.js` and `test/index.js` for more examples.
