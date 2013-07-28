test = cmd "fox -b"
jsify = bin "jsify"

all 'test/fixtures.js', 'test'

task 'test', ->
  debug 'Running the tests'
  test()

target 'test/fixtures.js', 'test/fixtures', ->
  debug 'Rendering fixtures'
  jsify 'test/fixtures/*.html -o test/fixtures.js'
