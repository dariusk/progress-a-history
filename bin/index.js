var jaled = require('../rulesets/jaled');
var choices = require('../rulesets/jaled/choices');
var repl = require('../players/common/repl');
var ajve = require('../players/jaled');
var civ = require('../civ');
var async = require('async');

require('longjohn');

var ai = Object.keys(choices).map(function (choice) {
  return civ.player.extend({
    name: choice,
    turn: function (i, world, choices, done) {
      if (choices.indexOf(choice) !== -1)
        done(null, choice);
      else
        done(null, choices[0]);
    }
  });
});

civ
.rules(jaled)
.players(ajve)
.players(ai)
.players(repl)
.play()
.report();
