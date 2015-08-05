var MathJax = require('MathJax-node/lib/mj-single.js');
var _ = require('underscore');
var Q = require('q');
var fs = require('fs');

MathJax.start();

// Application logic for typesetting.
var extractRawMath = function(text, prefix) {
  var mathRegex = new RegExp("^\s*" + prefix + "\s*(.*)$","g");
  var results = [];
  var match;
  while (match = mathRegex.exec(text)) {
    results.push({ // mathObject
      matchedText: match[0],
      input: match[1],
      output: null,
      error: null,
    });
  }
  return results;
};

var renderMath = function(mathObject, parseOptions) {
  var defaultOptions = {
    math: mathObject.input,
    format: 'AsciiMath',
    png: true,
    dpi: 600,
    font: 'TeX',
    ex: 12,
    width: 600,
    linebreaks: true,
  };
  var typesetOptions = _.extend(defaultOptions, parseOptions);
  var deferred = Q.defer();
  var typesetCallback = function(result) {
    if (!result || !result.png || !!result.errors) {
      mathObject.error = new Error('Invalid response from MathJax.');
      mathObject.output = result;
      deferred.reject(mathObject);
      return;
    }
    var filename = encodeURIComponent(mathObject.input).replace(/\%/g, 'pc') + '.png';
    var filepath = 'static/' + filename;
    if (!fs.existsSync(filepath)) {
      console.log('writing new PNG: %s', filename);
      var pngData = new Buffer(result.png.slice(22), 'base64');
      fs.writeFile(filepath, pngData, function(error) {
        if (error) {
          mathObject.error = error;
          mathObject.output = null;
          deferred.reject(mathObject);
        }
      });
    } else {
      console.log('using existing PNG: %s', filename);
    }
    mathObject.output = filepath;
    deferred.resolve(mathObject);
  };
  MathJax.typeset(typesetOptions, typesetCallback);
  return deferred.promise;
}

var typeset = function(text, prefixed) {
  var rawMathArray = extractRawMath(text, prefixed);
  if (rawMathArray.length === 0) {
    return null;
  }
  return Q.all(_.map(rawMathArray, renderMath));
};

module.exports = {
  typeset: typeset,
};
