/*

# Mial Yome

The Sea People of Jaled, the Mial Yome inhabit the lakes and mountains
of Izeuh.

The mountain ranges inhabited by the Mial Yome have long been
developed into solar collectors and artificial aquifers in order to
support their ambitious inhabitants, without damaging the underlying
ecosystem.

The Mial Yome arrived on Jaled on a vast inland lake, encircled by
mountain ranges and rocky wastes. Under the wastes, however, flows a
vast system of underground rivers and caves. There, the Mial Yome reside.
Many never spend a day outside of water, much less above ground.

These Sea People have crafted their homes and industries in intentional
co-evolution with their environment, so that they must rely on mutagenic
or scientific advancements to further reduce their footprint and allow
more ajve to survive sustainably.

*/

var civ = require('../../civ');

module.exports = civ.player.extend({
  name: "Mial Yome",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];

    // adapt?
    if (society.population > society.harmony)
      return done(null, 'adapt');

    // expand?
    if (society.yield > society.population * 2)
      return done(null, 'expand');

    // otherwise, discover
    return done(null, 'discover');
  }
});
