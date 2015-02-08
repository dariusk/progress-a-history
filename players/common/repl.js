var civ = require('../../civ');
var readline = require('readline');

function indent (n) {
  var args = Array.prototype.slice.call(arguments);
  args[0] = new Array(n).join(' ');
  console.log.apply(console, args);
}

var report = {
  // report a given world state
  // for a specific player
  turn: function (turn, world, i, n) {
    indent(n, 'TURN', turn);
    report.world(world, i, n * 2);
    report.player(world, i, n * 2);
  },
  world: function (world, i, n) {
    indent(n, 'WORLD');
    Object.keys(world)
    .filter(function (key) {
      return ['societies', 'feels'].indexOf(key) === -1;
    })
    .forEach(function (key) {
      indent(n * 2, key, world[key]);
    });

    world.societies.map(function (society, j) {
      if (i === j)
        indent(n, 'SOCIETY', j, 'YOU')
      else
        indent(n, 'SOCIETY', j);
      report.society(society, n * 2);
    });

    indent(n, 'FEELS');
    report.feels(world.feels, n * 2);
  },
  player: function (world, i, n) {
    indent(n, 'YOU', 'society', i);
    indent(n + 2, 'feels', world.feels[i])
    indent(n + 2, 'sleef', world.feels.map(function (feels, j) {
      return feels[i];
    }));
    report.society(world.societies[i], n * 2);
  },
  society: function (society, n) {
    Object.keys(society)
    .forEach(function (key) {
      indent(n, key, society[key]);
    });
  },
  feels: function (feels, n) {
    feels.forEach(function (feel, i) {
      indent(n, i, feel);
    });
  }
};

module.exports = civ.player.extend({
  name: 'repl',
  init: function () {
    this._turn = 0;
    this.make_rl = function (choices) {
      return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: function (line) {
          var hits = choices.filter(function (choice) { 
            return (choice.indexOf(line) === 0); 
          });
          return [hits, line];
        }
      });
    };

    this.ask = function ask (rl, choices, done) {
      rl.prompt();
      rl.on('line', function (choice) {
        if (choices.indexOf(choice) !== -1) {
          rl.close();
          done(null, choice); 
        }
        else
          rl.prompt();
      });
    };
  },
  turn: function (n, world, choices, done) {
    // if dead, skip to the end
    if (world.societies[n].dead) return done();
    // report this turn
    report.turn(this._turn++, world, n, 1);
    // prompt user for input
    indent(0, 'CHOOSE', choices.join(', '));
    var rl = this.make_rl(choices);
    this.ask(rl, choices, done);
  }
});
