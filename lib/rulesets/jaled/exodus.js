// The process of societal death and rebirth

var async = require('async');
var utils = require('./utils');
var shuffle = require('knuth-shuffle').knuthShuffle;
var civ = require('../../civ');

function new_name (parents) {
  return shuffle(parents.map(function (parent) {
      return shuffle(parent.name.split(' '))[0];
    })).slice(0, 3).join(' ');
}

function mode (arr) {
  return arr.sort(function(a,b){
    return arr.filter(function(v){ return v===a; }).length -
           arr.filter(function(v){ return v===b; }).length;
         }).pop();
}

function make_splinter (parents) {
  return civ.player.extend({
    name: new_name(parents),
    init: function () {
      this.parents = parents;
    },
    turn: function (i, world, choices, done) {
      async.map(parents, function (parent, done) {
        parent.turn(i, world, choices, done);
      }, function (err, result) {
        if (err)
          done(err);
        else
          done(null, mode(result));
      });
    }
  });
}

// (players, world)
// - players: array of bots currently in the game
// - world: the current world state
module.exports = function (players, world) {
  var new_bots = world.societies.map(function (society, i) {
      if (society.dead) {
        var parents = [players[i]].concat(shuffle(players).slice(0, 2));
        return make_splinter(parents);
      } else {
        return null;
      }
    }).filter(function (x) { return !!x; });
  players.push(new_bots);
  world.societies.push(new_bots.map(utils.make.society));
};
