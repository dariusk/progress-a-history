module.exports = {
  value: 'profit',
  effect: function (world, i) {
    // increase your wealth by 1
    world.societies[i].wealth += 1;
    // select the poorest society with >0 disposition towards you
    var target = world.societies.filter(function (society, j) {
      return (i !== j) && (society.feels[i] >= 0);
    }).sort(function (a, b) {
      return a.wealth - b.wealth;
    })[0];
    // they gain 1 resource, 1 wealth, and lose 1 disposition toward you
    if (target) {
      target.resources += 1;
      target.wealth += 1;
      target.feels[i] -= 1; 
    }
    // gain your wealth and theirs in resources
    world.societies[i].resources += world.societies[i].wealth + ((target && target.wealth) || 0);
  }
};
