
const test = require('tap').test;
const typeset = require('../../lib/typeset');
const q = require('q');
const _ = require('underscore');

test('spec', function (t) {
  t.type(typeset.typeset, 'function');
  t.type(typeset.extractRawMath, 'function');
  t.end();
});

test('createFileName', function (t) {
  const result = typeset.createFileName('ohyeah');
  console.log(result);
  const expected = 'static/'
    + 'ec5f0b0bf15f3e618dcfa50f21dd666b0ec96c4f38df0c68b8418c0d32b623d8.png';
  t.equal(result, expected);
  t.end();
});

test('extractRawMath', function (t) {
  const resultOne = typeset.extractRawMath('x=y','');
  t.type(resultOne, 'Array');
  t.equal(resultOne.length,1);
  const resultTwo = typeset.extractRawMath('x=y\ny=x','');
  t.equal(resultTwo.length,1);
  t.end();
});

test('renderMath', function (t) {
  const result = q.all(_.map(typeset.extractRawMath('x=y',''),
    typeset.renderMath));
  t.notEqual(result,null);
  t.end();
});
