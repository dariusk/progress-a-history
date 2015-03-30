var async = require('async');
var clone = require('clone');

var civ = require('../../civ');

var choices = require('./choices');
var exodus = require('./exodus');
var utils = require('./utils');

// prompts each player for their choice of value given the current world state
function make_choices (players, world, done) {
  // remember! dead societies do not make choices. their bots are frozen.
  var funcs = players.map(function (player, i) {
    if (world.societies[i].dead) {
      return function (done) { return done(); };
    } else {
      return player.turn.bind(player, i, clone(world), Object.keys(choices));
    }
  });

  return async.parallel(funcs, done);
}

// runs after societal choices have been made
// modifies the world accordingly
function process_choices (world, chosen, done) {
  chosen.forEach(function (choice, i) {
    // skip falsy choices like null and undefined
    if (!choice) return;
    // increase associated value by 1
    world.societies[i].values[choices[choice].value] += 1;
    // change the world
    choices[choice].effect(world, i);
  });
  done(null, world);
}

var JaledRuleset = civ.ruleset.extend({
  name: 'Jaled',
  choices: Object.keys(choices),
  // runs when ruleset is first instantiated
  init: function () {
  },
  // runs the game; returns a history of world-states
  game: function (players, options, done) {
    var game_length = options.turns || 25;
    var self = this;
    self.history = [];
    self.players = players;
    self.world = utils.make.world(self.players);

    return async.timesSeries(game_length, function (i, done) {
      async.applyEachSeries([
        self.before_turn,
        self.turn,
        self.after_turn
      ], self.players, self.world, function (err) {
        self.history.push(clone(self.world));
        done(err);
      });
    }, function (err) {
      done(err, self.history);
    });
  },
  before_turn: function (players, world, done) {
    // dead societies enter exodus
    exodus(players, world);
    return done();
  },
  turn: function (players, world, done) {
    return async.waterfall([
      // players make choices
      async.apply(make_choices, players, world),
      // choices affect world
      async.apply(process_choices, world)
    ], function (err) {
      done(err);
    });
  },
  after_turn: function (players, world, done) {
    // societies eat and die
    function get_hunger (society) {
      var hunger = ['might', 'wealth', 'infrastructure', 'subtlety'].map(function (attr) {
        return society[attr];
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
      var snacks = [society.adaptations, world.biodiversity].reduce(function (a, b) {
        return a + b;
      }, 0);
      return hunger - snacks;
    }

    world.societies.forEach(function (society, i) {
      var hunger = get_hunger(society);
      society.resources -= hunger;
      if (society.resources < 0)
        society.dead = true;
    });

    return done();
  }
});


module.exports = JaledRuleset;
