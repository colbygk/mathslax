const express = require('express');
const bodyparser = require('body-parser');
const pug = require('pug');
const util = require('util');
const entities = require('entities');

const log = require('./lib/log');
const typeset = require('./lib/typeset.js');

const SERVER = process.env.SERVER || '127.0.0.1';
const PORT = process.env.PORT || '8080';
const SLACK_AUTH_TOKEN = process.env.SLACK_AUTH_TOKEN || 'none';

// Install the routes.
const router = express.Router();

router.post('/typeset', function(req, res) {

  if (req.body.token !== SLACK_AUTH_TOKEN)
  {
    log.warn('Unrecongized or no token:',req.body.token);
    res.status(401).send();
    return;
  }

  var requestString = entities.decode(req.body.text);

  log.info('Request:',requestString);

  var typesetPromise = typeset.typeset(requestString, 'math!');

  if (typesetPromise === null) {
    res.send('no text found to typeset');
    res.end(); 
    return;
  }

  var promiseSuccess = function(mathObjects) {
    var locals = {'mathObjects': mathObjects,
                  'serverAddress': `http://${SERVER}:${PORT}/` };
    var htmlResult = pug.renderFile('./views/slack-response.pug', locals);
    res.json({'text' : htmlResult});
    res.end();
  };

  var promiseError = function(error) {
    log.info('Error in typesetting:');
    log.info(error);
    res.end(); // Empty 200 response.
  };

  typesetPromise.then(promiseSuccess, promiseError);

});

router.post('/slashtypeset', function(req, res) {

  if (req.body.token !== SLACK_AUTH_TOKEN)
  {
    log.warn('Unrecongized or no token:',req.body.token);
    res.status(401).send();
    return;
  }

  var requestString = entities.decode(req.body.text);

  var typesetPromise = typeset.typeset(requestString,'');

  if (typesetPromise === null) {
    res.send('no text found to typeset');
    res.end(); // Empty 200 response -- no text was found to typeset.
    return;
  }

  var promiseSuccess = function(mathObjects) {
    var locals = {'mathObjects': mathObjects,
                  'serverAddress': SERVER!='127.0.0.1' ? util.format('http://%s:%s/', SERVER, PORT) : 'http://'+req.headers.host+'/' };
    res.json({
      response_type: 'in_channel',
      text: requestString,
      attachments: [
        {
          fallback: requestString,
          image_url: 'http://' + SERVER + ':' + PORT + '/' + mathObjects[0].output,
        },
      ],
    });
    res.end();
  };

  var promiseError = function(error) {
    log.info('Error in typesetting:');
    log.info(error);
    res.end(); // Empty 200 response.
  };

  typesetPromise.then(promiseSuccess, promiseError);

});


// Start the server.
var app = express();

app.disable('x-powered-by');
app.use( (req,res,next) => {
  res.header('X-Powered-By','Love');
  next();
});
app.use(log.middleware);
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use('/static', express.static('static'));
app.use('/', router);

app.listen(PORT);
log.info(`Mathslax is listening at http://${SERVER}:${PORT}/`);
log.info('Make a test request with something like:');
log.info(`curl -v -X POST ${SERVER}:${PORT}/typeset --data ` +
            '\'{"text": "f(x) = E_0\\frac{x^2}{sin(x)}", "token": "none"}\' ' +
            '-H "Content-Type: application/json"');
log.info('****************************************');
