var setup = require("./setup");

module.exports = withExtensions;

function withExtensions(extensions){
  return function(query, context){
    return setup(extensions, query, context);
  };
}
