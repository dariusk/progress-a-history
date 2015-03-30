/*

Colonized by Jaled, the M'ne Gaana, the Forest People,
have become undead husks, serving the fungus that inhabits them.

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
    if (society.population > society.harmony)
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
