var jaled = require('../rulesets/jaled');
var choices = require('../rulesets/jaled/choices');
var civ = require('../civ');
var async = require('async');

var ai = Object.keys(choices).map(function (choice) {
  return civ.player.extend({
    turn: function (i, world, choices, done) {
      if (choices.indexOf(choice) !== -1)
        done(null, choice);
      else
        done(null, choices[0]);
    },
    inflection: function (i, world, choices, done) {
      done(null, choices[0]);
    }
  });
});

civ
.rules(jaled)
.game(ai)
.play()
.report();
