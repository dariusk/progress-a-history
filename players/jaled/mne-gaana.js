/*

# M'ne Gaana

The Forest People of Jaled, the M'ne Gaana, do not call themselves
that. The ship whose colonists would become the M'ne Gaana landed on
marshes home to millions of years of fungal and bacterial development.
What they made of those who landed, we call the M'ne Gaana.

A collection of microorganisms colonized the settlers as they settled
the land, developing them into undead, undying hosts for the land's
intent.

They shambled from the fog, not to devour brains, but to make peace.

The organisms that control the M'ne Gaana  know the suffering the ajve
caused, and the pain they feel. They would welcome them into the
land's embrace.

If they threaten the planet's ecology, though, the M'ne Gaana will
reduce them to soil.

*/

var civ = require('../../civ');

module.exports = civ.player.extend({
  name: "M'ne Gaana",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];

    var developers_exist = world.societies.filter(function (society, i) {
      return !society.dead;
    }).some(function (society) {
      return society.harmony < 0;
    });

    // adapt?
    if (society.population > society.harmony * 4)
      return done(null, 'adapt');

    // expand?
    if (society.yield > society.population * 2)
      return done(null, 'expand');

    // sabotage?
    if (developers_exist)
      return done(null, 'sabotage');

    // else, consent
    return done(null, 'consent');
  }
});
