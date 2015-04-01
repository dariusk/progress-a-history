var get_hunger = exports.get_hunger = function (i, world) {
  var society = world.societies[i];
  var takers = (society.might + society.wealth + society.infrastructure + society.subtlety);
  var givers = (society.adaptations + world.biodiversity);
  return takers - givers;
};
