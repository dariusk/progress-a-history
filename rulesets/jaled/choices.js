var VALUES = {
  empire: 'conquer',
  // TODO...
};

function consume (i, world) {
  // society consumes resources to support its way of life
  var society = world.societies[i];
  var upkeep = (society.might + society.wealth + society.infrastructure - society.wealth - world.biodiversity);
  world.societies[i].resources -= upkeep;

  return world;
}

var ACTIONS = {
  conquer: function (i, world) {
    var society = world.societies[i];
    // TODO...
  }
};

module.exports = {
  keys: Object.keys(VALUES),
  process: function (chosen, world) {
    return chosen.reduce(function (world, choice, i) {
      return ACTIONS[choice](i, world);
    }, world);
  }
};
