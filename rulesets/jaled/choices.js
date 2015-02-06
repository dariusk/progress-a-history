var clone = require('clone');

function max_feel (world, i) {
  var feels = clone(world.feels);
  var max = 0;
  feels[i].forEach(function (feel, j) {
    if ((max === i) && (j !== i))
      max = j;
    else if ((j !== i) && (feel >= feels[i][max]))
      max = j;
  });
  return max;
}

// returns the index of the player
// you like the least
function min_feel (world, i) {
  var feels = clone(world.feels);
  var min = 0;
  feels[i].forEach(function (feel, j) {
    if ((min === i) && (j !== i))
      min = j;
    else if ((j !== i) && (feel <= feels[i][min]))
      min = j;
  });
  return min;
}

function inc_feel (world, i, value) {
  return world.feels.map(function (feels, j) {
    if (j === i)
      return feels;
    else
      return feels.map(function (feel, k) {
        if (k === i)
          return feel + value;
        else
          return feel;
      });
  });
}

function sum_feels (world, i) {
  return world.feels.map(function (feels, j) {
    if (i === j)
      return 0;
    else
      return feels[i];
  }).reduce(function (a, b) {
    return a + b;
  });
}

module.exports = {
  discover: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    world.societies[i].yield += (population * 2);
    done(null, world);
  },
  expand: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var yield = society.population;
    world.societies[i].population += Math.floor((yield - population) / 2);
    done(null, world);
  },
  exchange: function (i, world, done) {
    var society = world.societies[i];
    var j = min_feel(world, i);
    var bonus = society.yield + world.societies[j].yield;
    world.societies[i].yield += bonus * 2;
    world.societies[j].yield += Math.floor(bonus / 2);
    world.feels[j][i] += 2;
    done(null, world);
  },
  develop: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var yield = society.population;
    world.yield -= population;
    world.societies[i].yield += (population * 3);
    world.societies[i].harmony += -1;
    world.feels = inc_feel(world, i, -1);
    done(null, world);
  },
  conquer: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var j = min_feel(world, i);
    world.societies[i].yield += (population * 3);
    world.societies[j].yield += -population;
    world.feels = inc_feel(world, i, -1);
    world.feels[j][i] += -2;
    done(null, world);
  },
  consent: function (i, world, done) {
    world.feels = inc_feel(world, i, 1);
    world.societies[i].yield += sum_feels(world, i);
    done(null, world);
  },
  adapt: function (i, world, done) {
    world.societies[i].harmony++;
    done(null, world);
  }
};
