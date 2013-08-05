var domflow = require('../../'),
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
