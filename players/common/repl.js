var civ = require('../../civ');
var readline = require('readline');

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
          ask(rl, choices, done);
      });
    };
  },
  turn: function (n, world, choices, done) {
    var society = world.societies[n];
    if (society.dead)
      return done(null, world);

    this._turn++;
    var rl = this.make_rl(choices);
    var indent = '  ',
        kndent = '    ';
    console.log('TURN', this._turn);
    console.log(indent, 'yield', world.yield);
    console.log(indent, 'feels');
    world.feels.forEach(function (feels, i) {
      console.log(kndent, i, JSON.stringify(feels));
    });
    world.societies.forEach(function (society, i) {
      if (i === n)
        console.log(indent, 'society', i, 'YOU');
      else
        console.log(indent, 'society', i, society.dead || '');
      console.log(kndent, 'yield', society.yield);
      console.log(kndent, 'population', society.population);
      console.log(kndent, 'harmony', society.harmony);
      console.log(kndent, 'age', society.age);
    });
    console.log('YOU', 'society', n);
    console.log(indent, 'feels', world.feels[n]);
    console.log(indent, 'yield', society.yield);
    console.log(indent, 'population', society.population);
    console.log(indent, 'harmony', society.harmony);
    console.log(indent, 'age', society.age);
    console.log('CHOOSE', choices.join(' or '));
    this.ask(rl, choices, done);
  }
});
