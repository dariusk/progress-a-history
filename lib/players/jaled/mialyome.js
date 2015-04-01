/*

The Sea People of Jaled, the Mial Yome inhabit Izeuh's underground
lakes and rivers, researching quietly, secretly.

------

# Mial Yome

*Mial (Mountain, Inside) Yome (People)*

Once-volcanic mountains pock the desolate lands of the Mial-Yome.
Inside them, natural acquifers and heavy rainfall seep through the
rock and collect inside the mountain, before travelling through a
network of underground rivers to the seas beyond. Though the barren
dust above hasn't hosted roots in millenia, life flourishes
beneath.

The Mial Yome plunged into the midst of this lightless ecosystem when
their ship crashed into one of these hollow mountain during planetfall. What survivors crawled
from the remains opened their eyes to perfect darkness, even as they
could smell the organisms teeming about them for miles and miles.

Only by salvaging the wreckage of their ship did the Mial Yome
survive. Learning to replace parts with alien materials, and adapting
their own bodies to serve instead, have made them fixtures of the lightless depths.

Invention, for so long the key to their survival, remains the
ideological thread that binds their social norms. Individuals live in
pods of three or four, and occasionaly organize multiple pods into
groups to conduct research and develop sophisticated tools, disbanding
afterwards. Chemical trails left by the researchers encode their
findings, communicating it downstream and disseminating it to any who
can understand.

Isolated from other peoples first by natural features, and then by a
cultural devotion to studying the planet that hosts them, the Mial
Yome rarely encounter other ajve voluntarily.

*/

var civ = require('../../civ');
var utils = require('./utils');

module.exports = civ.player.extend({
  name: "Mial Yome",
  init: function () {

  },
  turn: function (i, world, choices, done) {
    var society = world.societies[i];
    var hunger = utils.get_hunger(i, world);
    if (hunger > 0)
      return done(null, 'adapt');
    else
      return done(null, 'discover');
  }
});
