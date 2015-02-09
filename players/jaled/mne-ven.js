/*

# M'ne Ven

The Disciplined People of Jaled, the M'ne Ven, occupy a wasteland they
forged at planetfall.

The M'ne Ven ship hovered over the plains, the forests, the savannahs,
and let loose with weapons that reduced the landscape to glass. Then,
the colonists landed.

With the surface now a blank canvas, the M'ne Ven have painted a
brutal society, dedicated to transforming the land into an ajvic
paradise, and crushing those ajve that would betray the principles
that brought their people to Jaled.

Descending from ajvic military castes, the M'ne Ven regret only that
exterminating humanity left Earth uninhabitable. The genocide itself
has entered their mythos as their people's defining achievement.

Retaining the technology they brought to Jaled, the cities of the M'ne
Ven glisten with materials and techniques alien to this world,
floating above a landscape that boils from the heat of their engines.

*/

var civ = require('../../civ');

module.exports = civ.player.extend({
  name: "M'ne Ven",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];

    // develop?
    if (society.harmony > -society.population) {
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
