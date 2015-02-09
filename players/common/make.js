var civ = require('../../civ');

function make_ai (choices) {
  return Object.keys(choices).map(function (choice) {
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
}

module.exports = make_ai;
