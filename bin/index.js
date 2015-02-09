#!/usr/bin/env node

var progress = require('..');
var program = require('commander');
var pkg = require('../package.json');

program
.version(pkg.version)
.description(pkg.description)
.option('-j, --json', 'outputs raw JSON')
.option('-r, --rules <rules>', 'specifies the ruleset. defaults to jaled', 'jaled')
.option('-b, --basic', 'adds AI to brute-force different choices')
.option('-a, --autonomous', 'removes the AI the player controls directly')
.option('-t, --turns <turns>', 'number of turns in the game. defaults to 50', 50)
.parse(process.argv);



var rules = progress.rulesets[program.rules] || progress.rulesets.jaled;
var players = progress.players[program.rules] || progress.players.jaled;
var basic = program.basic && progress.players.common.make(rules.choices);
var human = !program.autonomous && progress.players.common.repl;

progress.civ
.rules(rules)
.players(players);

if (basic) progress.civ.players(basic);
if (human) progress.civ.players(human);

progress.civ
.play({
  turns: program.turns
})
.report({
  json: program.json
});
