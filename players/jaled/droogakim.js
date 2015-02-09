/*

The Dragon People of Jaled, the Droogakim, populate Izeuh's coasts and
seas, and control it with a golden fist.

*/

var civ = require('../../civ');

module.exports = civ.player.extend({
  name: "Droogakim",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];
    
    if (society.population > society.harmony)
      return done(null, 'adapt');

    if (society.yield > society.population * 2)
      return done(null, 'expand');

    var should_raid;
    world.societies.forEach((function (other_society, j) {
      if (i ===j) return;
      if (other_society.yield > society.yield * 2)
        should_raid = true;
    }));

    if (should_raid)
      return done(null, 'raid');
    else
      return done(null, 'exchange');
  }
});
