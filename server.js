var MathJax = require('MathJax-node/lib/mj-single.js');
var Express = require('express');
var BodyParser = require('body-parser');
var Q = require('q');
var _ = require('underscore');
var Jade = require('jade');

// Application logic for typesetting.
var extractRawMath = function(text) {
  var mathRegex = /math\(`(.*?)`\)/g;
  var results = [];
  var match;
  while (match = mathRegex.exec(text)) {
    results.push({ // mathObject
      matchedText: match[0],
      input: match[1],
      output: null,
      error: false,
    });
  }
  return results;
};

var parseMath = function(mathObject, parseOptions) {
  var defaultOptions = {
    math: mathObject.input,
    format: 'AsciiMath',
    svg: true,
    img: true,
    speaktext: false,
    ex: 6,
    width: 200,
    linebreaks: true,
  };
  var typesetOptions = _.extend(defaultOptions, parseOptions);
  var deferred = Q.defer();
  var typesetCallback = function(result) {

    if (!!result && !!result.svg) {
      // The result SVG from the MathJax server contains two lines of
      // unnecessary xml document set up which we don't need because we'll be
      // embedding the svgs in our own template.
      // var eol1 = result.svg.indexOf('\n') + 1;
      // var eol2 = result.svg.indexOf('\n', eol1) + 1;
      // var cleanedSVG = result.svg.slice(eol2);
      // mathObject.output = cleanedSVG;
      mathObject.output = result.svg;
      console.log('img?', result.img);
      console.log("Rendered expression:", mathObject.input);
      deferred.resolve(mathObject);
    } else {
      var error = new Error('invalid response from MathJax server');
      error.result = result;
      mathObject.error = error;
      deferred.reject(mathObject);
    }
  };
  MathJax.typeset(typesetOptions, typesetCallback);
  return deferred.promise;
}

var typeset = function(text) {
  var rawMathArray = extractRawMath(text);
  if (rawMathArray.length === 0) {
    return null;
  }
  return Q.all(_.map(rawMathArray, parseMath));
};


// Install the routes.
var router = Express.Router();
router.get('/', function(req, res) {
  res.json(['Hello', 'World', {underDevelopment: true}]);
});
router.post('/typeset', function(req, res) {
  var requestString = req.body.text;
  var typesetMathPromise = typeset(requestString);
  if (typesetMathPromise === null) {
    res.end(); // Empty 200 response -- no text was found to typeset.
    return;
  }
  var promiseSuccess = function(mathObjects) {
    var locals = {'mathObjects': mathObjects};
    var htmlResult = Jade.renderFile('./views/slack-response.jade', locals);
    res.json({'text' : htmlResult});
  };
  var promiseError = function(error) {
    console.log('Error in typesetting:');
    console.log(error);
    res.end(); // Empty 200 response.
  };
  typesetMathPromise.then(promiseSuccess, promiseError);
});


// Start the server.
var app = Express();
app.use(BodyParser.urlencoded({extended: true}));
app.use(BodyParser.json());
app.use('/', router);

var port = process.env.PORT || 8080;
app.listen(port);
console.log("Slax is listening on port " + port);
console.log("Make a test request with something like:");
console.log("curl -v -X POST 'localhost:%d/api/slotify' --data " +
            "'{\"text\": \"I got an equation like math(`f(x) = x^2/sin(x) * " +
            "E_0`)\"}' -H \"Content-Type: application/json\"", port);
console.log('___________\n');
