module.exports = {
  value: 'consent',
  effect: function (world, i) {
    // increase global disposition by 1
    world.societies.forEach(function (society, j) {
      if (i !== j) 
        world.societies[j].feels[i] += 1;
    });
    // gain 1 resource for each cooperative society
    var gifts = world.societies.filter(function (society, j) {
      return (i !== j) && (society.feels[i] >= 0);
    }).length;
    world.societies[i].resources += gifts;
    // all societies gain 1 yield
    world.societies.forEach(function (society, j) {
      world.societies[j].resources += 1;
    });
  }
};
