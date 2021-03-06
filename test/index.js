var attr = require('attr'),
    fixtures = require('./fixtures'),
    extensions = require('./extensions'),
    newList = require('new-list'),
    newFlow = require('../');

function beforeEach(){
  reset('');
}

describe('initializing scopeless basic layouts', function(){

  var flow = newFlow({
    'foo-text': extensions['foo-text'],
    'foo-class': extensions['foo-class']
  });

  it('shows a simple object', function(){
    reset(fixtures['simple.html']);

    flow('body', {
      title: 'hello world',
      content: 'this is the content'
    });

    expect(query('h1').innerHTML).to.equal('hello world');
    expect(query('div').innerHTML).to.equal('this is the content');
  });

  it('shows an array', function(){
    reset(fixtures['list.html']);

    var context = [
      { fruit: 'apple' },
      { fruit: 'banana' },
      { fruit: 'peach' },
      { fruit: 'watermelon' }
    ];

    flow('body', context);

    var all = queryAll('li');

    context.forEach(function(ctx, ind){
      expect(all[ind].innerHTML).to.equal(ctx.fruit);
    });

  });

  it('sets class attributes', function(){
    reset(fixtures['simple.html']);

    flow('body', {
      title: 'hello world',
      content: 'this is the content',
      'h1-class': 'span',
      'div-class': 'eggs'
    });

    expect(query('h1').classList.contains('span')).to.be.true;
    expect(query('h1').classList.contains('header')).to.be.true;

    expect(query('div').classList.contains('eggs')).to.be.true;
    expect(query('div').classList.contains('content')).to.be.true;
  });

  it('intializes an object on nested elements', function(){
    reset(fixtures['simple-nested.html']);

    flow('body', {
      title: 'hello world',
      content: 'this is the content',
      cls: 'eggs'
    });

    var h1 = query('#h1'),
        h2 = query('#h2'),
        h3 = query('#h3'),
        c1 = query('#c1'),
        c2 = query('#c2'),
        content = query('.content');

    expect(h1.innerHTML).to.equal('hello world');
    expect(h2.innerHTML).to.equal('hello world');
    expect(h3.innerHTML).to.equal('hello world');

    expect(c1.innerHTML).to.equal('this is the content');
    expect(c2.innerHTML).to.equal('this is the content');

    expect(content.classList.contains('eggs')).to.be.true;
    expect(c1.classList.contains('eggs')).to.be.true;
    expect(c2.classList.contains('eggs')).to.be.true;
    expect(h1.classList.contains('eggs')).to.be.true;
    expect(h3.classList.contains('eggs')).to.be.true;
  });

});

describe('initialization with scopes', function(){

  var flow = newFlow({
    'foo-text': extensions['foo-text'],
    'foo-class': extensions['foo-class'],
    'foo-iter': extensions['foo-iter']
  });

  it('shows an object with array', function(){
    reset(fixtures['scopes.html']);

    var fruits = [
      { name: 'apple' },
      { name: 'watermelon' },
      { name: 'banana' },
      { name: 'peach' },
      { name: 'orange' }
    ];

    var vegetables = [
      { name: 'tomato' },
      { name: 'aubergine' },
      { name: 'pepper' }
    ];

    flow('body', {
      title: 'hello world',
      name: 'Jack London',
      fruits: fruits,
      vegetables: vegetables
    });

    expect(query('h1').innerHTML).to.equal('hello world');
    expect(query('h4').innerHTML).to.equal('Jack London');

    expect(queryAll('.fruits li').length).to.equal(5);
    expect(queryAll('.vegetables li').length).to.equal(3);

    queryAll('.fruits li').forEach(function(el, ind){
      expect(el.innerHTML).to.equal(fruits[ind].name);
    });

    queryAll('.vegetables li').forEach(function(el, ind){
      expect(el.innerHTML).to.equal(vegetables[ind].name);
    });

  });

    it('shows two nested arrays', function(){
    reset(fixtures['list-nested.html']);

    var context = {
      fruits: [
        [{ fruit: 'apple' }, { fruit: 'banana' }, { fruit: 'peach' }],
        [{ fruit: 'watermelon' }, { fruit: 'cherry' }]
      ]
    };

    flow('body', context);

    var container = query('.container');
    var lists = queryAll('.fruits');
    var fruits1 = queryAll('.fruit', lists[0]),
        fruits2 = queryAll('.fruit', lists[1]);

    expect(lists.length).to.equal(2);

    fruits1.forEach(function(el, ind){
      expect(el.innerHTML).to.equal(context.fruits[0][ind].fruit);
    });

    fruits2.forEach(function(el, ind){
      expect(el.innerHTML).to.equal(context.fruits[1][ind].fruit);
    });

  });

});

describe('bindings', function(done){

  var flow = newFlow({
    'foo-text': extensions['foo-text'],
    'foo-class': extensions['foo-class'],
    'foo-iter': extensions['foo-iter'],
    'foo-val': extensions['foo-val']
  });

  it('updates title and content on data updates', function(done){
    reset(fixtures['simple.html']);

    var content = attr.attrs({
      title: 'hello world',
      content: 'this is the content'
    });

    flow('body', content);

    content.title('lorem ipsum');
    content.content('sit dolar amet');

    setTimeout(function(){
      expect(query('h1').innerHTML).to.equal('lorem ipsum');
      expect(query('div').innerHTML).to.equal('sit dolar amet');
      done()
    }, 500);

  });

  it('updates the layout on list data change', function(done){

    reset(fixtures['lists.html']);

    var content = {
      title: attr('hello world'),
      name: 'Jack London',
      fruits: newList('cherry', 'apple', 'banana', 'orange'),
      vegetables: newList('tomato', 'cabbage', 'lettuce')
    };

    flow('body', content);

    content.fruits.push('watermelon', 'grape');

    setTimeout(function(){

      var target = queryAll('.fruits > *');

      ['cherry', 'apple', 'banana', 'orange', 'watermelon', 'grape'].forEach(function(fruit, ind){
        expect(target[ind].innerHTML).to.be.equal(fruit);
      });

      done();

    }, 100);

  });

  it('updates the source when input has a new value', function(done){
    reset(fixtures['input.html']);

    var name = attr('Bruce Lee');

    flow('input', name);

    name.subscribe(function(update, old){
      expect(update).to.equal('John Smith');
      expect(old).to.equal('Bruce Lee');
      done();
    });

    var element = query('input');

    setTimeout(function(){
      element.value = 'John Smith';

      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      element.dispatchEvent(evt);
    }, 10);

  });

});

function query(selector){
  return document.querySelector(selector);
}

function queryAll(selector, el){
  return Array.prototype.slice.call((el || document).querySelectorAll(selector));
}

function reset(html){
  document.body.innerHTML = html;
}
