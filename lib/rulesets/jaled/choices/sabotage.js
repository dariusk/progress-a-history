module.exports = {
  value: 'secrets',
  effect: function (world, i) {
    // increase subtlety by 1
    world.societies[i].subtlety += 1;
    // gain 1 resource for every society with less subtlety;
    world.societies[i].resources += world.societies.filter(function (society, j) {
      return (i !== j) && (society.subtlety < world.societies[i].subtlety);
    }).length;
    // those societies lose 1 resource, or 2 if you dislike them
    world.societies.forEach(function (society, j) {
      if (i !== j) {
        society.resources += -1;
        if (world.societies[i].feels[j] < 0)
          society.resources += -1; 
      }
    });
    // lose 1 disposition with every society with more
    world.societies.forEach(function (society, j) {
      if ((i !== j) && (society.subtlety > world.societies[i].subtlety))
        society.feels[i] += -1;
    });
  }
};
