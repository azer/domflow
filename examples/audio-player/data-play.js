var playAudio = require('play-audio');

exports.setup = function (binding) {
  binding.player = playAudio(binding.source(), binding.element).controls().autoplay();
}

exports.subscribe = function (source, callback) {
  source.subscribe(callback);
}

exports.update = function (binding, update) {
  binding.player.src(update);
}
