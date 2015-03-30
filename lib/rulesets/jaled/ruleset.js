var shuffle = require('knuth-shuffle').knuthShuffle;
var async = require('async');
var clone = require('clone');

var civ = require('../../civ');

var choices = require('./choices');
var exodus = require('./exodus');
var utils = require('./utils');

// prompts each player for their choice of value given the current world state
function make_choices (players, world, done) {
  var funcs = players.map(function (player, i) {
    return player.turn.bind(player, clone(choices.keys), clone(world), i);
  });

  return async.parallel(funcs, done);
}

// runs after societal choices have been made
// modifies the world accordingly
function process_choices (world, chosen, done) {
  var new_world = choices.process(chosen, world);
  done(null, new_world);
}

var JaledRuleset = civ.ruleset.extend({
  name: 'Jaled',
  // runs when ruleset is first instantiated
  init: function () {
  },
  // runs before the game starts
  before_game: function (players, options, done) {
    this.world = utils.make.world(players);
    return done();
  },
  // runs the game; returns a history of world-states
  game: function (players, options, done) {
    var game_length = options.turns || 25;
    var i = 0;
    var self = this;
    self.players = players;

    return async.timesSeries(game_length, function (i, done) {
      async.waterfall([
        // prompts players for choices on the given world state
        make_choices.bind(null, self.players, self.world),
        // modify the world based on given choices
        process_choices.bind(null, self.world),
        // spawn societies from any who died
        // returning [new_world, new_players]
        exodus.bind(null, self.players)
      ], function (err, results) {
        if (err) {
          return done(err);
        } else {
          self.world = results[0];
          self.players = results[1];
          return done(null, clone(self.world));
        }
      });
    }, done);
  }
});


module.exports = JaledRuleset;
