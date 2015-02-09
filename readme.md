# Progress: A History

Guide an engineered people as they settle an alien world.

**HEY. This project isn't ready. Go away.**

## Install

	npm install -g progress-a-history
	// watch AI play the game
	progress -a
	// play the game
	progress
	// play a long game
	progress -t 200

## Customize

Write your own AI, and your own rulesets. 
PaH can encompass any game involving 
players making decisions that affect a shared world.

In a new project, install PaH:

	npm install progress-a-history

Then, in a JavaScript file, use the library:

	var progress = require('progress-a-history');

	var ai = progress.civ.player.extend({
		...
		});

	var ruleset = progress.civ.ruleset.extend({
		...
		});

	progress.civ
	.rules(ruleset)
	.players(ai)
	.play()
	.report();

## Test

[![Build Status](https://travis-ci.org/garbados/progress-a-history.svg?branch=master)](https://travis-ci.org/garbados/progress-a-history)

To run the tests yourself, run this in terminal:

	git clone git@github.com:garbados/progress-a-history.git
	cd progress-a-history
	npm install
	npm test

## License

[Apache v2](http://www.apache.org/licenses/LICENSE-2.0), yo.
