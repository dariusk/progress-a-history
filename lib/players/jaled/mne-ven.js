/*

The Disciplined People of Jaled,
descended from military castes,
brutally devoted to ajvic supremacy.

------

# M'ne Ven

*M'ne (People) Ven (Discipline)*

Before planetfall, the M'ne Ven ship hovered over the plains, the forests, the savannahs,
and let loose with weapons that reduced the landscape to glass. Then,
the colonists landed.

Atop the now-barren continent, these descendants of ajvic military
orders have constructed an industrial utopia. Every aspect of every
place most M'ne Ven will ever see, exists because they willed it so.
Fantastic devices procure everything the colonists need, assembling
it from matter stripped from the planet.

Mineshafts reaching the planet's core pock the land beneath
the hovering cities of the M'ne Ven, whose engines boil the land.
Their towers gleam with materials and techniques alien to this world.

Retaining a heirarchy structured for war, the M'ne Ven regret only that
exterminating humanity left Earth uninhabitable. The genocide itself
has entered their mythos as their people's defining achievement.

*/

var civ = require('../../civ');
var utils = require('./utils');

module.exports = civ.player.extend({
  name: "M'ne Ven",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];
    var hunger = utils.get_hunger(i, world);

    if (society.resources < hunger * 3)
      return done(null, 'develop');
    else
      return done(null, 'conquer');
  }
});
