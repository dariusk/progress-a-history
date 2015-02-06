var async = require('async');

function SplinterPlayer (players) {
  this.merge(players);
}

SplinterPlayer.prototype.merge = function (players) {
  this._players = (this._players || []).concat(players);
}

SplinterPlayer.prototype.turn = function (i, world, choices, done) {
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
};

module.exports = function (players) {
  return new SplinterPlayer(players);
};
