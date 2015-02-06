function make_society (player, age) {
  return {
    yield: 6 * (age || 1),
    population: 3 * (age || 1),
    harmony: 1,
    age: 1
  };
}

function make_feels (n, m) {
  var feels = [];
  for (var i = 0; i < n; i++) {
    feels[i] = [];
    for (var j = 0; j < (m || n); j ++) {
      feels[i][j] = 0;
    }
  }

  return feels;
}

function make_world (players) {
  var world = {
    yield: 20,
    feels: make_feels(players.length),
    societies: players.map(make_society)
  };

  return world;
}

module.exports = {
  make: {
    world: make_world,
    feels: make_feels,
    society: make_society
  }
};
