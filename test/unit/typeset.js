
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

  const resultThree = typeset.extractRawMath('math! x=y','math!');
  t.equal(resultThree.length,1);

  const resultFour = typeset.extractRawMath('x=y','math!');
  t.notEqual(resultFour.length,1);

  t.end();
});

test('renderMath', async function (t) {
  var promiseOne = q.all(_.map(typeset.extractRawMath('x=y',''),
    typeset.renderMath));
  t.notEqual(promiseOne,null);
  t.type(promiseOne, 'Promise');
  promiseOne.then(
    (mathObjects) => {
      t.type(mathObjects, 'Array');
      t.equal(mathObjects.length,1);
    },
    (err) => {
      t.equal(err, null);
    });

  var promiseTwo = q.all(_.map(typeset.extractRawMath('math! x=y',''),
    typeset.renderMath));
  t.notEqual(promiseTwo,null);
  promiseTwo.then(
    (mathObjects) => {
      t.type(mathObjects, 'Array');
      t.equal(mathObjects.length,1);
    },
    (err) => {
      t.equal(err, null);
    });

  var promiseThree = q.all(_.map(typeset.extractRawMath('math! x=y','math!'),
    typeset.renderMath));
  t.notEqual(promiseThree,null);
  promiseThree.then(
    (mathObjects) => {
      t.type(mathObjects, 'Array');
      t.equal(mathObjects.length,1);
    },
    (err) => {
      t.equal(err, null);
    });

  var promiseFour = q.all(_.map(typeset.extractRawMath('x=y','math!'),
    typeset.renderMath));
  t.notEqual(promiseFour,null);
  promiseFour.then(
    (mathObjects) => {
      t.type(mathObjects, 'Array');
      t.equal(mathObjects.length,0);
    },
    (err) => {
      t.notEqual(err, null);
    });

});

