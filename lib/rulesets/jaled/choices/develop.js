module.exports = {
  value: 'mastery',
  effect: function (world, i) {
    var society = world.societies[i];
    // sew the fields
    society.infrastructure++;
    world.biodiversity--;
    // reap the harvest
    society.resources += society.infrastructure * 2;
    // anger the world
    world.societies.forEach(function (society, j) {
      if (i === j) return;
      society.feels[i]--;
    });

    return world;
  }
};
