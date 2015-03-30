// test each choice to ensure
// 1. it does what it says
// 2. it modifies the given world object

if (process.env.NODE_COVERAGE) {
  var choices = require('../../../cov-lib/rulesets/jaled/choices');
  var utils = require('../../../cov-lib/rulesets/jaled/utils');
  var exodus = require('../../../cov-lib/rulesets/jaled/exodus');
  var ruleset = require('../../../cov-lib/rulesets/jaled/ruleset');
} else {
  var choices = require('../../../lib/rulesets/jaled/choices');
  var utils = require('../../../lib/rulesets/jaled/utils');
  var exodus = require('../../../lib/rulesets/jaled/exodus');
  var ruleset = require('../../../lib/rulesets/jaled/ruleset');
}

var clone = require('clone');
var assert = require('assert');

var initial_society = {
  might: 0,
  wealth: 0,
  infrastructure: 0,
  adaptations: 0,
  subtlety: 0,
  resources: 3,
  feels: [0, 0, 0]
};

var initial_world = {
  biodiversity: 3,
  societies: [
    clone(initial_society),
    clone(initial_society),
    clone(initial_society)
  ]
};

describe('jaled', function () {
  describe('utils', function () {
    it('should make worlds for arbitrary numbers of players', function () {
      var players = [{}, {}, {}, {}];
      var world = utils.make.world(players);
      assert(world.societies.length === players.length);
      assert(world.societies[0].feels[0] === 0);
    });
  });
  describe('exodus', function () {
    it('should splinter a new bot', function () {
      var players = [{
        name: 'rip van winkle'
      }, {
        name: 'o mi yage'
      }, {
        name: 'dan chris jeff'
      }];
      var world = utils.make.world(players);
      world.societies[0].dead = true;
      exodus(players, world);
      assert(players.length === 4);
      assert(players[3].name);
    });
  });  
  describe('choices', function () {
    describe('conquer', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society, harms others', function () {
        var i = 0,
            j = 1;
        var initial_resources = this.world.societies[i].resources;
        var initial_resources_j = this.world.societies[j].resources;

        choices.conquer.effect(this.world, i);
        assert(this.world.societies[i].resources > initial_resources);
        assert(this.world.societies[j].resources < initial_resources_j);
      });
    });
    describe('trade', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society, and another. sort of.', function () {
        var i = 0;
        var initial_resources = this.world.societies[i].resources;
        choices.trade.effect(this.world, i);
        assert(this.world.societies[i].resources > initial_resources);
      });
    });
    describe('discover', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society', function () {
        var i = 0;
        var initial_resources = this.world.societies[i].resources;
        choices.discover.effect(this.world, i);
        assert(this.world.societies[i].resources > initial_resources);
      });
    });
    describe('develop', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society, harms others', function () {
        var i = 0;
        var initial_resources = this.world.societies[i].resources;
        choices.develop.effect(this.world, i);
        assert(this.world.societies[i].resources > initial_resources);
      });
    });
    describe('organize', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society, and others', function () {
        var i = 0;
        var initial_resources = this.world.societies[i].resources;
        choices.organize.effect(this.world, i);
        assert(this.world.societies[i].resources > initial_resources);
      });
    });
    describe('adapt', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society, and the world', function () {
        var i = 0;
        var initial_adaptations = this.world.societies[i].adaptations;
        choices.adapt.effect(this.world, i);
        assert(this.world.societies[i].adaptations > initial_adaptations);
      });
    });
    describe('sabotage', function () {
      beforeEach(function () {
        this.world = clone(initial_world);
      });

      it('improves your society, harms others', function () {
        var i = 0;
        var initial_resources = this.world.societies[i].resources;
        choices.sabotage.effect(this.world, i);
        assert(this.world.societies[i].resources > initial_resources);
      });
    });
  });
  describe('ruleset', function () {
    it('should play a game', function (done) {
      var players = [{
        name: "ag var ip",
        turn: function (i, world, choices, done) {
          return done(null, choices[0]);
        }
      }, {
        name: "gar ba dos",
        turn: function (i, world, choices, done) {
          return done(null, choices[1]);
        }
      }, {
        name: "yal et fu",
        turn: function (i, world, choices, done) {
          return done(null, choices[2]);
        }
      }];
      ruleset.play(players, {
        turns: 1
      }, function (err, results) {
        assert(!err);
        assert(ruleset.history.length === 1);
        return done();
      });
    });
  });
});
