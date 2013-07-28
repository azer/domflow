var bind = require("./bind");

module.exports = withExtensions;

function withExtensions(extensions){
  return function(query, context){
    return bind(extensions, query, context);
  };
}
