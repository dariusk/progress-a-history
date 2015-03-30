/*

The Disciplined People of Jaled,
descended from military castes,
brutally devoted to ajvic supremacy.

*/

var civ = require('../../civ');

module.exports = civ.player.extend({
  name: "M'ne Ven",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];

    // develop?
    if (society.yield < society.population - society.harmony) {
      // NOTE: eventually, low harmony overpowers develop's high yield
      // causing the M'ne Ven to lose before turn 20, all on their own
      return done(null, 'develop');
    }

    // conquer?
    var enemies = world.feels.filter(function (feels, j) {
      return feels[i] < 0;
    });
    if (enemies) 
      return done(null, 'conquer');
    
    // consent?
    return done(null, 'consent');
  }
});
