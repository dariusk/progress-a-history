/*

The Dragon People of Jaled, the Droogakim, populate Izeuh's coasts and
seas as careful and ruthless attendants to the water's health.

-----

# Droogakim

*Drooga (Dragon-like) Kim (Culture)*

The Dragon People of Jaled, the Droogakim, populate Izeuh's coasts and
seas.

During planetfall, their ship plunged into open ocean, forcing the
ajvic pilgrims to negotiate with Jaled's aquatic leviathans in order
to survive. Myth says their ship plunged into the heart of a Droogas,
a massive sea-dragon, whose death imparted the echo of its soul to every
colonist aboard.

Migrating along the sea floor and along the coasts, Droogakim associate in groups
only incidentally to the seasonal movements and behavior of other
aquatic life. Individuals band together to hunt and for sport, but spend
most of their life on their own, in the midst of the alien ecosystems
they graze on and tend to.

When hunting parties cull Jaled's oceanic leviathans, individuals will scour
the corpse for remains worth trading to inland peoples. Groups will cull leviathans,
such as a Droogas, or the massive ameoboid Alfotas, as expressions of their skill
as hunters, and of the health of their sea. "Sickly waters bear no dragons,"
you might hear.

Droogakim travel inland almost exclusively to trade, such that the M'ne Ven
typically encounter the Dragon People as warrior-merchants, whose mercantilism
involves more obvious violence than the commerce of old.

*/

var civ = require('../../civ');
var utils = require('./utils');

module.exports = civ.player.extend({
  name: "Droogakim",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    // adapt until you can provide for your own
    var society = world.societies[i];
    var hunger = utils.get_hunger(i, world);
    if (hunger > 0)
      return done(null, 'adapt');

    // friends to trade with?
    var friends = world.societies.filter(function (society, j) {
      return society.feels[i] >= 0;
    });
    if (friends.length > 0)
      return done(null, 'trade');

    // else, raid the coasts for goodies
    return done(null, 'conquer');
  }
});
