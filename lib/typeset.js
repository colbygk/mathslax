const mathjax = require('mathjax-node-svg2png');
const _ = require('underscore');
const q = require('q');
const fs = require('fs');
const crypto = require('crypto');

const log = require('./log');

mathjax.start();

// Application logic for typesetting.
const extractRawMath = function(text, prefix) {
  var mathRegex = new RegExp('^\s*' + prefix + '\s*((\n|.)*)','g');
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

const renderMath = (mathObject, parseOptions) => {
  var defaultOptions = {
    math: mathObject.input,
    format: 'TeX',
    png: true,
    font: 'TeX',
    width: 600,
    linebreaks: true,
    timeout: 30 * 1000,
  };

  var typesetOptions = _.extend(defaultOptions, parseOptions);
  var deferred = q.defer();

  mathjax.typeset(typesetOptions, (result) => {
    if (!result || !result.png || !!result.errors) {
      mathObject.error = new Error('Invalid response from MathJax.');
      mathObject.output = result;
      deferred.reject(mathObject);
      return;
    }
  
    const hash = crypto.createHash('sha256');
    hash.update(mathObject.input);
    const filename = hash.digest('hex') + '.png';
    const filepath = 'static/' + filename;
  
    if (!fs.existsSync(filepath)) {
      log.info('writing new PNG: %s', filename);
      var pngData = new Buffer(result.png.slice(22), 'base64');
      fs.writeFile(filepath, pngData, (error) => {
        if (error) {
          mathObject.error = error;
          mathObject.output = null;
          deferred.reject(mathObject);
        }
      });
    } else {
      log.info('using existing PNG: %s', filename);
    }
    mathObject.output = filepath;
    deferred.resolve(mathObject);
  });

  return deferred.promise;
}

var typeset = function(text, prefixed) {
  var rawMathArray = extractRawMath(text, prefixed);
  if (rawMathArray.length === 0) {
    return null;
  }
  return q.all(_.map(rawMathArray, renderMath));
};

module.exports = {
  typeset: typeset,
};
