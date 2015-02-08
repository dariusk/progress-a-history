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

function max_yield (world) {
  var yields = world.societies.map(function (society) {
    return society.yield;
  });
  return yields.indexOf(Math.max.apply(Math, yields));
}

// indexes of players taking 'develop' actions
function get_developers (world) {
  var developers = world.societies.map(function (society, i) {
    if (society.harmony < 0)
      return i;
    else
      return null;
  }).filter(function (index, i) {
    return index !== null;
  });

  developers.sort(function (a, b) {
    return world.societies[a].harmony - world.societies[b].harmony;
  });

  return developers;
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
    var yield = society.yield;
    world.societies[i].population += Math.floor((yield - population) / 2);
    done(null, world);
  },
  exchange: function (i, world, done) {
    var society = world.societies[i];
    var j = max_feel(world, i);
    var bonus = society.population + world.societies[j].population;
    world.societies[i].yield += bonus;
    world.societies[j].yield += Math.floor(bonus / 2);
    world.feels[j][i] += 2;
    done(null, world);
  },
  develop: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var yield = society.population;
    world.yield -= population;
    world.societies[i].harmony += -population;
    world.societies[i].yield += (population * 3);
    done(null, world);
  },
  conquer: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var j = min_feel(world, i);
    world.societies[i].yield += (population * 2);
    world.societies[j].yield += -population;
    world.feels = inc_feel(world, i, -1);
    world.feels[j][i] += -2;
    done(null, world);
  },
  raid: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var j = max_yield(world);
    world.societies[i].yield += (population * 2);
    world.societies[j].yield += -population;
    world.feels = inc_feel(world, i, -1);
    world.feels[j][i] += -2;
    done(null, world);
  },
  sabotage: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var j = get_developers(world)[0];
    if (j) {
      world.societies[i].yield += (population * 2);
      world.societies[j].yield += -population;
      world.feels = inc_feel(world, i, -1);
      world.feels[j][i] += -2; 
    }
    done(null, world);
  },
  consent: function (i, world, done) {
    world.feels = inc_feel(world, i, 1);
    world.societies[i].yield += Math.floor(sum_feels(world, i) / world.feels.length);
    done(null, world);
  },
  // adapt your people to the planet
  // rather than the other way around.
  // reducing food consumption,
  // and increasing global yield
  adapt: function (i, world, done) {
    var society = world.societies[i];
    var population = society.population;
    var yield = society.population;
    world.societies[i].harmony += Math.floor(population / 2);
    world.yield += society.yield;
    done(null, world);
  }
};
