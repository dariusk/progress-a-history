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
function min_harmony (world) {
  var harmonies = world.societies.map(function (society, i) {
    return society.harmony;
  });
  return harmonies.indexOf(Math.min.apply(Math, harmonies));
}

function war (world, i, j) {
  var population = world.societies[i].population;
  world.societies[i].yield += (population * 2);
  world.societies[j].yield -= population;
  world.feels = inc_feel(world, i, -1);
  
  // break if the target is already dead
  if (world.societies[j].dead)
    return;

  if (world.societies[j].population < population)
    world.societies[j].population -= 1;
  if (world.societies[j].population < 1)
    world.societies[j].dead = true;
  world.feels[j][i] += -2;
}

var choices = {
  // research new means of survival
  discover: function (i, world, done) {
    world.societies[i].yield += world.societies[i].population * 2;
    done(null, world);
  },
  // grow in population
  expand: function (i, world, done) {
    world.societies[i].population++;
    done(null, world);
  },
  // raise your yield and a friend's
  exchange: function (i, world, done) {
    var j = max_feel(world, i);
    var bonus = world.societies[i].population +
                world.societies[j].population;
    world.societies[i].yield += bonus;
    world.societies[j].yield += Math.floor(bonus / 2);
    world.feels[j][i] += 2;
    done(null, world);
  },
  // greatly raise yield
  // but lower harmony
  develop: function (i, world, done) {
    world.societies[i].harmony--;
    world.yield += -world.societies[i].population;
    world.societies[i].yield += world.societies[i].population * 5;
    done(null, world);
  },
  // crush the most hated people
  conquer: function (i, world, done) {
    var j = min_feel(world, i);
    war(world, i, j);
    done(null, world);
  },
  // steal from the wealthiest people
  raid: function (i, world, done) {
    var j = max_yield(world);
    war(world, i, j);
    done(null, world);
  },
  // compromise the infrastructure
  // of the most developed people
  sabotage: function (i, world, done) {
    var j = min_harmony(world);
    war(world, i, j);
    done(null, world);
  },
  // affirm relations with all ajve
  // reaping the benefits of universal cooperation
  // or paying the price of reparations
  consent: function (i, world, done) {
    world.feels = inc_feel(world, i, 1);
    world.societies[i].yield += Math.floor(sum_feels(world, i) / world.feels.length);
    done(null, world);
  },
  // adapt your people to the planet
  // rather than the other way around.
  // increases harmony, 
  // which lowers yield consumption
  // and increases global yield
  adapt: function (i, world, done) {
    world.societies[i].harmony++;
    done(null, world);
  }
};

module.exports = choices;
