var async = require('async');
var civ = require('../../civ');

module.exports = function (players) {
  return civ.player.extend({
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
        return player.turn.bind(player, world, i, choices);
      });

      async.parallel(tasks, function (err, res) {
        done(null, mode(res));
      });
    }
  });
};
