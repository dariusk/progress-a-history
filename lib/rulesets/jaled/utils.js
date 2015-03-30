function make_society (player, i) {
  return {
    name: player.name || 'society-' + i,
    resources: 3,
    might: 0,
    wealth: 0,
    infrastructure: 0,
    adaptations: 0
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
    biodiversity: 3,
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
