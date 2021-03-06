if (typeof(window) === 'undefined') var loki = require('../../src/lokijs.js');

describe('Testing operators', function () {

  var db, tree;
  beforeEach(function() {
    db = new loki('testOps'),
    tree = db.addCollection('tree'),

    /*
     * The following data represents a tree that should look like this:
     *
     ├A
     ├B
     └───┐
         ├C
     ├D
     └───┐
         ├E
         ├F
     ├G
     └───┐
         ├H
         ├I
         └───┐
             ├J
             ├K
         ├L
         ├M
     ├N
     └───┐
         ├O
         ├P
         └───┐
             ├Q
             └───┐
                 ├R
                 └───┐
                     ├S
                 ├T
             ├U
         ├V
     ├W
     ├X
     └───┐
         ├Y
         ├Z
    *
    */

    tree.insert([
      { text: 'A', value: 'a', id: 1,  order: 1,  parents_id: [],               level: 0, open: true, checked: false },
      { text: 'B', value: 'b', id: 2,  order: 2,  parents_id: [],               level: 0, open: true, checked: false },
      { text: 'C', value: 'c', id: 3,  order: 3,  parents_id: [2],              level: 1, open: true, checked: false },
      { text: 'D', value: 'd', id: 4,  order: 4,  parents_id: [],               level: 0, open: true, checked: false },
      { text: 'E', value: 'e', id: 5,  order: 5,  parents_id: [4],              level: 1, open: true, checked: false },
      { text: 'F', value: 'f', id: 6,  order: 6,  parents_id: [4],              level: 1, open: true, checked: false },
      { text: 'G', value: 'g', id: 7,  order: 7,  parents_id: [],               level: 0, open: true, checked: false },
      { text: 'H', value: 'h', id: 8,  order: 8,  parents_id: [7],              level: 1, open: true, checked: false },
      { text: 'I', value: 'i', id: 9,  order: 9,  parents_id: [7],              level: 1, open: true, checked: false },
      { text: 'J', value: 'j', id: 10, order: 10, parents_id: [7, 9],           level: 2, open: true, checked: false },
      { text: 'K', value: 'k', id: 11, order: 11, parents_id: [7, 9],           level: 2, open: true, checked: false },
      { text: 'L', value: 'l', id: 12, order: 12, parents_id: [7],              level: 1, open: true, checked: false },
      { text: 'M', value: 'm', id: 13, order: 13, parents_id: [7],              level: 1, open: true, checked: false },
      { text: 'N', value: 'n', id: 14, order: 14, parents_id: [],               level: 0, open: true, checked: false },
      { text: 'O', value: 'o', id: 15, order: 15, parents_id: [14],             level: 1, open: true, checked: false },
      { text: 'P', value: 'p', id: 16, order: 16, parents_id: [14],             level: 1, open: true, checked: false },
      { text: 'Q', value: 'q', id: 17, order: 17, parents_id: [14, 16],         level: 2, open: true, checked: false },
      { text: 'R', value: 'r', id: 18, order: 18, parents_id: [14, 16, 17],     level: 3, open: true, checked: false },
      { text: 'S', value: 's', id: 19, order: 19, parents_id: [14, 16, 17, 18], level: 4, open: true, checked: false },
      { text: 'T', value: 't', id: 20, order: 20, parents_id: [14, 16, 17],     level: 3, open: true, checked: false },
      { text: 'U', value: 'u', id: 21, order: 21, parents_id: [14, 16],         level: 2, open: true, checked: false },
      { text: 'V', value: 'v', id: 22, order: 22, parents_id: [14],             level: 1, open: true, checked: false },
      { text: 'W', value: 'w', id: 23, order: 23, parents_id: [],               level: 0, open: true, checked: false },
      { text: 'X', value: 'x', id: 24, order: 24, parents_id: [],               level: 0, open: true, checked: false },
      { text: 'Y', value: 'y', id: 25, order: 25, parents_id: [24],             level: 1, open: true, checked: false },
      { text: 'Z', value: 'z', id: 26, order: 26, parents_id: [24],             level: 1, open: true, checked: false }
    ]);
  });

  it('$size works', function () {
	res = tree
      .chain()
      .find({
        'parents_id': {'$size': 4}
      })
    expect(res.data().length).toEqual(1);
    expect(res.data()[0].value).toEqual('s');
  });
});

describe("Individual operator tests", function() {

  var ops;
  beforeEach(function() {
    ops = loki.LokiOps;
  });

  it('$ne op works as expected', function () {
    expect(ops.$ne(15, 20)).toEqual(true);

    expect(ops.$ne(15, 15.0)).toEqual(false);

    expect(ops.$ne(0, "0")).toEqual(true);

    expect(ops.$ne(NaN, NaN)).toEqual(false);

    expect(ops.$ne("en", NaN)).toEqual(true);

    expect(ops.$ne(0, NaN)).toEqual(true);
  });

  it('$between op works as expected', function() {
    expect(ops.$between(75, [5, 100])).toEqual(true);
    expect(ops.$between(75, [75, 100])).toEqual(true);
    expect(ops.$between(75, [5, 75])).toEqual(true);
    expect(ops.$between(75, [5, 74])).toEqual(false);
    expect(ops.$between(75, [76, 100])).toEqual(false);
    expect(ops.$between(null, [5, 100])).toEqual(false);
  });

  it('$between find works as expected', function() {
    // test unindexed code path    
    var db = new loki('db');
    var coll = db.addCollection('coll');
    coll.insert({ name : 'mjolnir', count: 73 });
    coll.insert({ name : 'gungnir', count: 5 });
    coll.insert({ name : 'tyrfing', count: 15 });
    coll.insert({ name : 'draupnir', count: 132 });

    // simple inner between
    var results = coll.chain().find({count: {$between: [10, 80]}}).simplesort('count').data();
    expect(results.length).toEqual(2);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(73);

    // range exceeds bounds
    results = coll.find({count: {$between: [100, 200]}});
    expect(results.length).toEqual(1);
    expect(results[0].count).toEqual(132);

    // no matches in range
    expect(coll.find({count: {$between: [133, 200]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [1, 4]}}).length).toEqual(0);

    // multiple low and high bounds
    var db = new loki('db');
    var coll = db.addCollection('coll');
    coll.insert({ name : 'first', count: 5});
    coll.insert({ name : 'mjolnir', count: 15 });
    coll.insert({ name : 'gungnir', count: 15 });
    coll.insert({ name : 'tyrfing', count: 75 });
    coll.insert({ name : 'draupnir', count: 75 });
    coll.insert({ name : 'last', count: 100});

    results = coll.chain().find({count: {$between: [15, 75]}}).simplesort('count').data();
    expect(results.length).toEqual(4);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(15);
    expect(results[2].count).toEqual(75);
    expect(results[3].count).toEqual(75);

    // now test indexed code path    
    var db = new loki('db', {indices: ['count']});
    var coll = db.addCollection('coll');
    coll.insert({ name : 'mjolnir', count: 73 });
    coll.insert({ name : 'gungnir', count: 5 });
    coll.insert({ name : 'tyrfing', count: 15 });
    coll.insert({ name : 'draupnir', count: 132 });

    results = coll.chain().find({count: {$between: [10, 80]}}).simplesort('count').data();
    expect(results.length).toEqual(2);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(73);

    results = coll.find({count: {$between: [100, 200]}});
    expect(results.length).toEqual(1);
    expect(results[0].count).toEqual(132);

    expect(coll.find({count: {$between: [133, 200]}}).length).toEqual(0);
    expect(coll.find({count: {$between: [1, 4]}}).length).toEqual(0);

    var db = new loki('db');
    var coll = db.addCollection('coll', {indices: ['count']});
    coll.insert({ name : 'first', count: 5});
    coll.insert({ name : 'mjolnir', count: 15 });
    coll.insert({ name : 'gungnir', count: 15 });
    coll.insert({ name : 'tyrfing', count: 75 });
    coll.insert({ name : 'draupnir', count: 75 });
    coll.insert({ name : 'last', count: 100});

    results = coll.chain().find({count: {$between: [15, 75]}}).simplesort('count').data();
    expect(results.length).toEqual(4);
    expect(results[0].count).toEqual(15);
    expect(results[1].count).toEqual(15);
    expect(results[2].count).toEqual(75);
    expect(results[3].count).toEqual(75);
  });

});
