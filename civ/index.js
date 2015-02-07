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
  this._games = [];
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

Civ.prototype.game = function (players) {
  this._games.push(players);
  return this;
};

Civ.prototype.play = function (opts) {
  var self = this;
  var ruleset = this._ruleset;
  var deferred = q.defer();

  async.map(this._games, function (players, done) {
    async.applyEachSeries([
      ruleset.before_game,
      ruleset.game,
      ruleset.after_game
    ], players, done);
  }, function (err) {
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(ruleset.history);
  });

  this._playing = deferred.promise;

  return this;
};

Civ.prototype.report = function (opts) {
  this._playing.then(function (reports) {
    console.log(JSON.stringify(reports, undefined, 2));
  });

  return this;
};

module.exports = new Civ();
