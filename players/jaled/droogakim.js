/*

# Droogakim

The Dragon People of Jaled, the Droogakim, populate Izeuh's coasts and
seas.

During planetfall, their ship plunged into open ocean, forcing the
ajvic pilgrims to negotiate with Jaled's aquatic leviathans in order
to survive. Myth says their ship plunged into the heart of a Droogas,
a massive sea-dragon, whose death imparted the echo of its soul to every
colonist aboard.

The Droogakim encounter others as merchants and warriors, bringing
the bounty of the ocean to trade, and dragging their enemies into the
waters.

Though these Dragon People have established themselves as apex
predators of coastal waters, they have adapted to the landscape more
than demanding the landscape adapt to them.

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
