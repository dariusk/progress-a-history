/*

# M'ne Ven

The descendants of ajvic command,
the Disciplined People of Jaled, the M'ne Ven,
occupy a wasteland they forged at planetfall.

The M'ne Ven ship hovered over the plains,
the forests, the savannahs, and let loose with weapons
that reduced the landscape to glass. 
Then, the colonists landed.

With the surface now a blank canvas,
the M'ne Ven have painted a brutal society,
dedicated to transforming the land into an ajvic paradise,
and crushing those ajve that would betray the principles
that brought their people to Jaled.

*/

var civ = require('../../civ');

module.exports = civ.player.extend({
  name: "M'ne Ven",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];

    // expand?
    if (society.yield > society.population * 3)
      return done(null, 'expand');

    // develop?
    if (society.harmony > -society.population) {
      return done(null, 'develop');
    }
    
    // conquer?
    return done(null, 'conquer');
  }
});
