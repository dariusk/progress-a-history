var Table = require('cli-table');

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
  console.log({
    players: this.players.map(function (player, i) {
      return player.name || ['society', i].join(' ');
    }),
    history: this.history
  }, undefined, 2);
};

Reporter.prototype._print = {};
Reporter.prototype._print.society = function (tab_size, world, i) {
  var player = this.players[i];
  var society = world.societies[i];

  // politics
  var politics_headers = ['#'].concat(Object.keys(world.feels));
  var politics = new Table({
    head: politics_headers,
    colWidths: [10].concat(politics_headers.slice(1).map(function () { return 5; }))
  });
  politics.push(['FEELS'].concat(world.feels[i]));
  politics.push(['SLEEF'].concat(world.feels.map(function (feels, j) {
    return feels[i];
  })));
  // domestics
  var domestics = new Table({ });
  Object.keys(society).map(function (key) {
    
  });
  domestics.push(cells);

  var display = new Table({
    head: ['SOCIETY', 'FEELS'],
  });
  display.push([domestics, politics]);
  console.log(display.toString());
}

Reporter.prototype.console = function () {
  var self = this;
  var players = this.players;
  var last_turn = this.history.slice(-1)[0];
  var tab_size = 2;
  var print = this._print.society.bind(this, tab_size);
  var groups = {
    casualties: function (world) {
      world.societies
      .map(function (society, i) {
        return i;
      })
      .filter(function (i) {
        return world.societies[i].dead;
      })
      .forEach(print.bind(self, world));
    },
    highest_yield: function (world) {
      world.societies
      .map(function (society, i) {
        return i;
      })
      .sort(function (a, b) {
        return world.societies[a].yield - world.societies[b].yield;
      })
      .slice(-3)
      .forEach(print.bind(self, world));
    },
    most_populous: function (world) {
      world.societies
      .map(function (society, i) {
        return i;
      })
      .sort(function (a, b) {
        return world.societies[a].population - world.societies[b].population;
      })
      .slice(-3)
      .forEach(print.bind(self, world));
    },
    most_liked: function (world) {
      world.societies
      .map(function (society, i) {
        return i;
      })
      .sort(function (a, b) {
        return world.feels.map(function (feel, i) {
                return feel[a];
               }).reduce(function (a, b) {
                return a + b;
               }) - world.feels.map(function (feel, i) {
                return feel[b];
               }).reduce(function (a, b) {
                return a + b;
               });
      })
      .slice(-3)
      .forEach(print.bind(self, world));
    },
    least_liked: function (world) {

    },
    most_adapted: function (world) {

    },
    most_alien: function (world) {

    },
    oldest: function (world) {

    },
    youngest: function (world) {

    }
  };

  indent(0, 'TURN', this.history.length, '(post-game)');
  indent(tab_size, 'WORLD');
  indent(tab_size * 2, 'yield', last_turn.yield);
  indent(tab_size, 'NAMES');
  players.forEach(function (player, i) {
    indent(tab_size, '#', i + 1, '\t', player.name);
  });

  indent(tab_size, 'SOCIETIES');
  var society_fields = ['yield','population', 'harmony', 'age', 'dead'];
  indent(tab_size, '#\t', society_fields.join(','));
  last_turn.societies.forEach(function (society, i) {
    indent(tab_size, '#', i + 1, '\t', society_fields.map(function (key) {
      return society[key];
    }).join('\t'))
  });

  indent(tab_size, 'FEELS', '(v: others->you, h: you->others)');
  indent(tab_size, '\t #' + last_turn.feels.map(function (_, i) { 
    return i + 1; 
  }).join('\t#'));
  last_turn.feels.forEach(function (feels, i) {
    indent(tab_size, '#' + (i + 1) + '\t', feels.join('\t'));
  });

};

module.exports = Reporter;
