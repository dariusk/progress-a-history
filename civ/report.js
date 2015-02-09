function indent (n) {
  var args = Array.prototype.slice.call(arguments);
  args[0] = new Array(n).join(' ');
  console.log.apply(console, args);
}

function Reporter (players, history) {
  this.players = players;
  this.history = history;
}

Reporter.prototype.json = function () {
  console.log(JSON.stringify({
    players: this.players.map(function (player, i) {
      return player.name || ['society', i].join(' ');
    }),
    history: this.history
  }));
};

Reporter.prototype._print = {};
Reporter.prototype._print.world = function (tab_size, players, turn, world) {
  indent(0, 'TURN', turn);
  indent(tab_size, 'WORLD');
  indent(tab_size * 2, 'yield', world.yield);
  indent(tab_size, 'NAMES');
  players.forEach(function (player, i) {
    indent(tab_size, '#', i + 1, '\t', player.name);
  });

  indent(tab_size, 'SOCIETIES');
  var society_fields = ['yield','population', 'harmony', 'age', 'dead'];
  indent(tab_size, '#\t', society_fields.join(','));
  world.societies.forEach(function (society, i) {
    indent(tab_size, '#', i + 1, '\t', society_fields.map(function (key) {
      return society[key];
    }).join('\t'));
  });

  indent(tab_size, 'FEELS', '(v: others->you, h: you->others)');
  indent(tab_size, '\t #' + world.feels.map(function (_, i) { 
    return i + 1; 
  }).join('\t#'));
  world.feels.forEach(function (feels, i) {
    indent(tab_size, '#', i + 1, '\t', feels.join('\t'));
  });
};

Reporter.prototype.console = function () {
  var self = this;
  var players = this.players;
  var tab_size = 2;
  var print = this._print.world.bind(null, tab_size, players);

  [0, this.history.length - 1]
  .forEach(function (turn) {
    print(turn, self.history[turn]);
  });
};

module.exports = Reporter;
