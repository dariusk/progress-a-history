var Reporter = require('./report');
var async = require('async');
var q = require('q');

// RULESET OBJECT

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

RuleSet.prototype.choices = []; // array of possible choices. used for creating default bots
RuleSet.prototype.before_game = function (players, opts, done) { return done(); };
RuleSet.prototype.game = function (players, opts, done) { return done(); };
RuleSet.prototype.after_game = function (players, opts, done) { return done(); };

RuleSet.prototype.play = function (players, opts, done) {
  if (!done) {
    done = opts;
    opts = {};
  }

  async.applyEachSeries([
    this.before_game,
    this.game,
    this.after_game
  ], players, opts, done);
};

// PLAYER OBJECT

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
  return new Player(opts);
};

Civ.prototype.ruleset = {};
Civ.prototype.ruleset.extend = function (opts) {
  return new RuleSet(opts);
};

Civ.prototype.rules = function (ruleset) {
  this._ruleset = ruleset;
  return this;
};

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

  ruleset.play(players, opts || {}, function (err) {
    if (err)
      deferred.reject(err);
    else
      deferred.resolve(ruleset.history);
  });

  this._playing = deferred.promise;

  this._playing.fail(console.trace);

  return this;
};

Civ.prototype.report = function (opts) {
  var self = this;
  this._playing
  .then(function (history) {
    var players = self._players;
    var report = new Reporter(players, history);
    if (opts && opts.json)
      return report.json();
    else
      return report.console();
  })
  .fail(console.trace);

  return this;
};

module.exports = new Civ();
