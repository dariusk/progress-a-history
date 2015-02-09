var civ = require('../../civ');
var shuffle = require('knuth-shuffle').knuthShuffle;
var async = require('async');
var clone = require('clone');
var make = require('./world').make;
var splinter = require('./splinters');
var choices = require('./choices');

var JaledRuleset = civ.ruleset.extend({
  name: 'Jaled',
  // runs when ruleset is first instantiated
  init: function () {
    this.choices = choices;
    this.scores = [];

    this.feels = {
      // returns the index of the player
      // you like the most
      max: function (world, i) {
        var feels = clone(world.feels);
        var max = 0;
        feels[i].forEach(function (feel, j) {
          if ((max === i) && (j !== i))
            max = j;
          else if ((j !== i) && (feel >= feels[i][max]))
            max = j;
        });
        return max;
      },
      // returns the index of the player
      // you like the least
      min: function (world, you) {
        var feels = clone(world.feels);
        var min = 0;
        feels[you].forEach(function (feel, them) {
          if ((min === you) && (them !== you))
            min = them;
          else if ((them !== you) && (feel <= feels[you][min]))
            min = them;
        });
        return min;
      }
    };
  },
  // runs before the game starts
  before_game: function (turns, players, done) {
    this._players = players;
    this.history = [make.world(players)];

    done();
  },
  // runs when the game starts
  game: function (turns, players, done) {
    var self = this;

    async.timesSeries(turns, function (i, done) {
      self.current_turn = i;
      var world = self.history[i];
      var tasks = self._players.map(function (player, j) {
        // dead players make no choices
        if (world.societies[j].dead)
          return function (done) { done(); };
        // while the living have free reign
        else
          // note: pass in cloned world so players can't possibly mess
          // with the real deal
          return player.turn.bind(player, j, clone(world), Object.keys(self.choices));          
      });

      async.parallel(tasks, function (err, choices) {
        var turn = [
          self.before_turn,
          self.turn,
          self.after_turn
        ].map(function (func, j) {
          if (j === 0)
            return func.bind(self, choices, world);
          else
            return func.bind(self, choices);
        });

        async.waterfall(turn, done);
      });
    }, done);
  },
  // runs after the game
  after_game: function (turns, players, done) {
    // TODO ...?
    done();
  },
  // executes before each turn
  before_turn: function (choices, world, done) {
    done(null, world);
  },
  // executes each turn
  turn: function (choices, world, done) {
    var self = this;
    var tasks = choices.map(function (choice, i) {
      if (choice)
        return self.choices[choice].bind(self, i);
      else
        // players may pass `null`
        // dead players always pass `null`
        return function (world, done) {
          done(null, world); 
        };
    });

    tasks[0] = tasks[0].bind(self, world);

    async.waterfall(tasks, done);
  },
  // runs after each turn
  after_turn: function (choices, world, done) {
    var self = this;

    // societies age
    world.societies.forEach(function (society, i) {
      if (!society.dead)
        world.societies[i].age++;
    });

    // societies eat; some die
    world.societies
    .map(function (society, i) {
      // cost for population, and ecological damage
      return society.population - society.harmony;
    })
    .map(function (hunger, i) {
      // eat from the local reserve
      // or reap the fruits of the land
      if (hunger < 0) {
        world.societies[i].yield += Math.abs(hunger);
        return 0;
      } else if (hunger > world.societies[i].yield) {
        hunger -= world.societies[i].yield;
        world.societies[i].yield = 0;
        return hunger;
      } else {
        world.societies[i].yield -= hunger;
        return 0;
      }
    })
    .map(function (hunger, i) {
      // eat from the global reserve
      if (hunger > 0) {
        if (hunger > world.yield) {
          hunger -= world.yield;
          world.yield = 0;
          return hunger;
        } else {
          world.yield -= hunger;
          return 0;
        }
      } else {
        return 0;
      }
    })
    .map(function (hunger, i) {
      // populations starve, or die
      if (hunger > 0) {
        if (hunger > world.societies[i].population) {
          hunger -= world.societies[i].population;
          world.societies[i].population = 0;
          world.societies[i].dead = true;
          return hunger;
        } else {
          world.societies[i].population -= hunger;
          return 0;
        }
      } else {
        return 0;
      }
    });

    // the world heals, or sickens
    var sum_harmonies = world.societies.map(function (society, i) {
      return society.harmony;
    }).reduce(function (a, b) {
      return a + b;
    });
    var avg_harmonies = Math.floor(sum_harmonies / world.societies.length);
    world.yield = Math.floor(world.yield * 1.1) + avg_harmonies;

    // the dead rot, and yield life
    world.societies.filter(function (society, i) {
      // only the recently dead, that is
      return society.dead && society.age === self.history.length;
    })
    // for each dead society, add splinter societies
    .forEach(function () {
      // pick 0-2 societies
      var num_splinters = Math.floor(Math.random() * 2);
      // create splinters
      if (num_splinters) for (var j = 0; j < num_splinters; j++) {
        var parents = shuffle(self._players.filter(function (player) {
          return (player.name !== 'repl');
        })).slice(-5);
        var new_splinter = splinter(parents);
        // add each splinter to the players and societies lists
        self._players.push(new_splinter);
        world.societies.push(make.society(new_splinter));
        for (var k = 0; k < world.feels.length; k++) {
          world.feels[k].push(0);
        }
        world.feels[world.feels.length] = make.feels(1, self._players.length)[0];
      }
    });

    this.history.push(clone(world));

    done(null, world);
  },
});


module.exports = JaledRuleset;
