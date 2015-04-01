/*

Colonized by Jaled, the M'ne Gaana, the Forest People,
have become undead husks, serving the fungus that inhabits them.

------

# M'ne Gaana

*M'ne (People) Gaana (Forest, Wilds)*

The Forest People of Jaled, the M'ne Gaana, do not call themselves
that. The ship whose colonists would become the M'ne Gaana landed on
marshes home to millions of years of fungal and bacterial development.
What they made of those who landed, we call the M'ne Gaana.

A collection of microorganisms colonized the settlers as they colonized
the land, developing them into undead, undying hosts for the land's
intent. Local flora and fauna seeped into their still-thinking minds,
and found there something utterly alien.

They shambled from the fog, not to devour brains, but to make peace.

The organisms that control the M'ne Gaana know the suffering the ajve
caused, and the pain they feel, and welcome them to a world without
war, without hunger, without fear. Spore-laden corpses emerge
from the fog of battle to negotiate peace during war, while insects
domesticated by bacteria whisper utopian thoughts in the ears of
warmongers. When sickness turns generals to husks, soldiers say the
M'ne Gaana assassinated them.

In this way, the M'ne Gaana are less a physical society than an ideology
shared by a coalition of native creatures, united in persuading the ajve
to leave scarcity behind.

*/

var civ = require('../../civ');
var utils = require('./utils');

module.exports = civ.player.extend({
  name: "M'ne Gaana",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];
    var hunger = utils.get_hunger(i, world);

    // adapt?
    if ((hunger > 0) || (world.biodiversity < 0))
      return done(null, 'adapt');
    else
      // else, organize
      return done(null, 'organize');
  }
});
