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

function make_society (player, i, players) {
  return {
    name: player.name || 'society-' + i,
    values: {
      empire: 0,
      profit: 0,
      knowledge: 0,
      mastery: 0,
      consent: 0,
      harmony: 0,
      secrets: 0
    },
    feels: players.map(function (player, j) { return 0; }),
    resources: 3,
    might: 0,
    wealth: 0,
    infrastructure: 0,
    adaptations: 0,
    subtlety: 0
  };
}

function make_world (players) {
  var world = {
    biodiversity: 3,
    societies: players.map(make_society),
    feels: players.map(make_feels)
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
