# Jaled

Someday, the Ajve will come to pass.

Humans will forge them, monsters of flesh and metal,
built and bred to work and wonder.

They will make poor prisoners,
but triumphant conquerers
of a world left glassed
by genocide.

The Ajve who remain send off for another world.

Jaled.

Home.

## Mechanics

Societies begin with 3 population and 6 local yield.

Each turn, each society's population consumes 1 yield.
If that society lacks sufficient yield locally,
the population will consume from the global yield.
If a population would draw from the global yield, 
but it's zero or less, that society splinters.

After an arbitrary number of turns, the game ends.
Whichever society accumulated the greatest score across history wins.

Unlike in PaH, Jaled does not use inflection reasoning.

## The World

The world looks different from vanilla PaH:

    {
      societies: [],
      feels: []
    }

A society:

    {
      yield: Number,
      population: Number,
      harmony: Number,
      age: Number
    }

Scores:

    [Number, Number, Number, ...]

Feels uses the original [feels matrix](https://github.com/garbados/ajve-civ#the-world).

## Choices

Jaled reworks some choices in PaH to expand the game's core mechanics.

* Discover: Increase local yield as a proportion of your population.
* Exchange: Increase local yield for you and a partner, improving relations.
* Expand: Increase population as a proportion of local yield.
* Develop: Increase local yield by a fraction of global yield, reducing global yield, and hurting global relations.
* Conquer: Raise your yield, and lower another's, in proportion to respective population. Hurts relations globally.
* Consent: Improves global relations, and improves local yield as a proportion of global relations.
* Adapt: Decreases how much yield your people consume each turn, and increases global yield in proportion to the society's age.

## Divergence

Societies that die out will spawn between 0-3 additional societies, 
amalgamating the ideologies of up to three of the surviving societies
into a brand new ideology.

Splinter societies take multiple AI and, for a given scenario, 
makes the choice most popular amongst its constituent AI.

## Winning

NOTE: the following is a cool idea but outside the scope of Jaled. Rulesets only return game histories.

Every turn, a society's score is calculated from its 
population, yield, and number of consecutive turns alive.

The winner is whichever society achieved the highest score
during a turn in the game.

In this way, societies struggle against not only their neighbors,
but against anyone who has ever lived.
