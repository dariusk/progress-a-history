/*

The Sea People of Jaled, the Mial Yome inhabit Izeuh's underground
lakes and rivers, researching quietly, secretly.

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
