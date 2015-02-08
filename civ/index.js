var async = require('async');
var q = require('q');

// PLAYER OBJECT

function RuleSet (opts) {
  var self = this;
  Object.keys(opts).forEach(function (key) {
    if (typeof opts[key] === 'function')
      self[key] = opts[key].bind(self);
    else
      self[key] = opts[key];
  });

  if (this.init) this.init();
}

// RULESET OBJECT

function Player (opts) {
  var self = this;
  Object.keys(opts).forEach(function (key) {
    if (typeof opts[key] === 'function')
      self[key] = opts[key].bind(self);
    else
      self[key] = opts[key];
  });

  if (this.init) this.init();
}

// CIV OBJECT

function Civ () {
  this._players = [];
}

Civ.prototype.player = {};
Civ.prototype.player.extend = function (opts) {
  return new Player(opts)
};

Civ.prototype.ruleset = {};
Civ.prototype.ruleset.extend = function (opts) {
  return new RuleSet(opts);
};

Civ.prototype.rules = function (ruleset) {
  this._ruleset = ruleset;
  return this;
}

Civ.prototype.players = function (players) {
  if (players.length)
    Array.prototype.push.apply(this._players, players);
  else
    this._players.push(players);
  return this;
};

Civ.prototype.play = function (opts) {
  var self = this;
  var ruleset = this._ruleset;
  var players = this._players;
  var deferred = q.defer();

  async.applyEachSeries([
    ruleset.before_game,
    ruleset.game,
    ruleset.after_game
  ], players, function (err) {
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(ruleset.history);
  });

  this._playing = deferred.promise;

  return this;
};

Civ.prototype.report = function (opts) {
  var self = this;
  this._playing.then(function (reports, i) {
    console.log('last turn');
    var last_turn = reports.slice(-1)[0];
    var societies = last_turn.societies;
    var players = self._ruleset._players;
    var named_societies = societies.map(function (society, j) {
      var player = players[j];
      return {
        name: player.name,
        society: society
      };
    })
    named_societies.sort(function (a, b) {
      return a.society.yield - b.society.yield;
    });
    console.log('yield', last_turn.yield);
    console.log(named_societies);
  });

  return this;
};

module.exports = new Civ();
