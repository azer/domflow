test = cmd "fox -b"
jsify = bin "jsify"
serve = bin 'serve'
one = bin 'one/onejs'

all 'test/fixtures.js', 'test'

task 'examples', ->
  serve()

target 'examples/audio-player', 'examples/audio-player/data*.js', 'examples/audio-player/index.js', 'lib', ->
  one 'examples/audio-player/index.js -o examples/audio-player/build.js'

task 'test', ->
  debug 'Running the tests'
  test()

target 'test/fixtures.js', 'test/fixtures', ->
  debug 'Rendering fixtures'
  jsify 'test/fixtures/*.html -o test/fixtures.js'
