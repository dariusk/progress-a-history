#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package.json');

var jaled = require('../rulesets/jaled');
var repl = require('../players/common/repl');
var make_ai = require('../players/common/make');
var ajve = require('../players/jaled');
var civ = require('../civ');

var ai = make_ai(jaled);

program
.version(pkg.version)
.description(pkg.description)
.option('-j, --json', 'outputs raw JSON')
.parse(process.argv);

civ
.rules(jaled)
.players(ajve)
.players(make_ai(jaled))
// .players(repl)
.play(program)
.report();
