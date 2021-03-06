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
    if (society.dead && !society.human) {
      var bots = players.filter(function (p) { return !p.human; });
      var parents = [players[i]].concat(shuffle(bots).slice(0, 2));
      return make_splinter(parents);
    } else {
      return null;
    }
  }).filter(function (x) { 
    return !!x; 
  });

  // add feels for new societies to each existing society
  world.societies.forEach(function (society, i) {
    var new_feels = new_bots.map(function () { return 0; });
    world.societies[i].feels.push(new_feels);
  });
  
  new_bots.forEach(function (bot) {
    players.push(bot);
    world.societies.push(utils.make.society(bot, null, players));
  });
};
