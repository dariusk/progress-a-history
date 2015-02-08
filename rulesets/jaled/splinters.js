var async = require('async');
var civ = require('../../civ');

module.exports = function (players) {
  var counts = {};
  var names = players.map(function (player) { return player.name; })
                    .join('-')
                    .split('-')
                    .filter(function (name) {
                      return Number.isNaN(parseInt(name));
                    });

  names.forEach(function (name) {
    if (counts[name] === undefined)
      counts[name] = 0;
    counts[name] += 1;
  });

  var name = Object.keys(counts).map(function (name, i) {
    var count = counts[name];
    return [name, count].join('-');
  }).join('-');

  return civ.player.extend({
    name: name,
    init: function () {
      this._players = (players.length && players) || [];
    },
    turn: function (i, world, choices, done) {
      function mode (arr) {
        return arr.sort(function(a,b){
          return arr.filter(function(v){ return v===a }).length
               - arr.filter(function(v){ return v===b }).length;
        }).pop();
      }

      var tasks = this._players.map(function (player, j) {
        return player.turn.bind(player, i, world, choices);
      });

      async.parallel(tasks, function (err, res) {
        done(null, mode(res));
      });
    }
  });
};
