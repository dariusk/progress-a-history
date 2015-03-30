module.exports = {
  value: 'empire',
  effect: function (world, i) {
    var you = world.societies[i];
    // increase might
    you.might++;
    // filter society indexes to those
    // with lower might than this society
    var targets = Object.keys(world.societies)
    .filter(function (j) {
      var other = world.societies[j];
      return (i !== j) && (you.might > other.might);
    });
    // gain resources
    you.resources += targets.length;
    // harm targets
    targets.forEach(function (j) {
      var other = world.societies[j];
      if (you.feels[j] < 0) {
        other.resources -= 2;
      } else {
        other.resources -= 1;
      }
    });

    return world;
  }
};
