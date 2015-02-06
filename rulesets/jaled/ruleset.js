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
  before_game: function (players, done) {
    this._players = players;
    this.history = [];
    this.world = make.world(players);

    done();
  },
  // runs when the game starts
  game: function (players, done) {
    var self = this;

    async.timesSeries(20, function (i, done) {
      self.current_turn = i;
      var tasks = self._players.map(function (player, j) {
        // dead players make no choices
        if (self.world.societies[j].dead)
          return function (done) { done(null, null); };
        // while the living have free reign
        else
          return player.turn.bind(player, j, self.world, Object.keys(self.choices));
      });

      async.parallel(tasks, function (err, choices) {
        async.applyEachSeries([
          self.before_turn,
          self.turn,
          self.after_turn
        ], choices, self.world, done);
      });
    }, done);
  },
  // runs after the game
  after_game: function (players, done) {
    // TODO ...?
    done();
  },
  // executes before each turn
  before_turn: function (choices, world, done) {
    this.history.push(clone(world));
    done();
  },
  // executes each turn
  turn: function (choices, world, done) {
    var self = this;
    var tasks = choices.map(function (choice, i) {
      if (choice !== null)
        return self.choices[choice].bind(self, i);
      else
        // players may pass `null`
        // dead players always pass `null`
        return function (world, done) { done(null, world); };
    });

    tasks[0] = tasks[0].bind(self, world);

    async.waterfall(tasks, done);
  },
  // runs after each turn
  after_turn: function (choices, world, done) {
    var self = this;

    // societies eat; some die
    world.societies.forEach(function (society, i) {
      var hunger;
      if (society.harmony > 0)
        hunger = society.population / society.harmony;
      if (society.harmony < 0)
        hunger = society.population + Math.abs(society.harmony);
      else
        hunger = society.population;

      if (hunger > society.yield) {
        hunger += -Math.max(society.yield, 0);
        society.yield = 0;
        world.yield += -hunger;
        // societies die
        if (world.yield <= 0)
          society.dead = true;
      } else {
        society.yield += -hunger;
      }
    });

    // the dead rot, and yield life
    world.societies.filter(function (society, i) {
      return society.dead;
    })
    // for each dead society, add splinter societies
    .forEach(function () {
      // pick 0-2 societies, bias toward 0
      // TODO splintering causes massive processor load
      // solution a: make societies hardier
      // solution b: splinter less
      // 2/6/15: reduced game length to 20 to mitigate load problem
      var num_splinters = Math.max(Math.floor(Math.random() * 4) - 2, 0);
      var k;
      // create splinters
      if (num_splinters) for (var j = 0; j < num_splinters; j++) {
        var parents = shuffle(clone(self._players)).slice(-3);
        var new_splinter = splinter(parents);
        // add each splinter to the players and societies lists
        self._players.push(new_splinter);
        world.societies.push(make.society(new_splinter, self.current_turn));
        world.feels.push(make.feels(1, self._players.length));
      }
    });

    done();
  },
});


module.exports = JaledRuleset;
