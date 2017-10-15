
const test = require('tap').test;
const typeset = require('../../lib/typeset');

test('spec', function (t) {
  t.type(typeset.typeset, 'function');
  t.type(typeset.extractRawMath, 'function');
  t.end();
});

test('createFileName', function (t) {
  const result = typeset.createFileName('ohyeah');
  t.end();
});

test('extractRawMath', function (t) {
  const result = typeset.extractRawMath('x=y','');
  t.end();
/*
  , function (err, res, body) {
    t.equal(err, null);
    t.type(res, 'object');
    t.equal(res.statusCode, 200);
    t.type(body, 'string');
    t.end();
  });
*/
});

