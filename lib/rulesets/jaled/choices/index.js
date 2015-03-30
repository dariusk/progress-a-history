var adapt = require('./adapt');
var conquer = require('./conquer');
var develop = require('./develop');
var discover = require('./discover');
var organize = require('./organize');
var sabotage = require('./sabotage');
var trade = require('./trade');

function Choice (opts) {
  // the ideological value that inspires the choice
  this.value = opts.value;
  // a function with args (world, n)
  // that returns the world after
  // the nth society executes on this choice
  this.effect = opts.effect;
  // an array of strings, paragraphs, of vignettes 
  // of progressively more fantastic societies
  // N.B.: value thresholds for these vignettes are determined by the ruleset
  this.vignettes = opts.vignettes || [];
}

module.exports = {
  adapt:    new Choice(adapt),
  conquer:  new Choice(conquer),
  develop:  new Choice(develop),
  discover: new Choice(discover),
  organize: new Choice(organize),
  sabotage: new Choice(sabotage),
  trade:    new Choice(trade)
};