function make_society (player) {
  return {
    yield: 6,
    population: 3,
    harmony: 1,
    age: 0
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
    societies: players.map(function (player) { return make_society(player); })
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
