# @m4rch/4css

## v0.2.4

*2021-07-11*

- fix: no longer tries to save json files

## v0.2.3

*2021-07-11*

- fix: parameter no longer get reversed (mixin)
- fix: args now also work in extends (mixin)

## v0.2.2

*2021-07-11*

- fix: mixin extends now get added
- minor fix: error message now displays correctly, when not enough arguments are given to a mixin

***

- added more shortcuts

## v0.2.1

*2021-07-11*

- fixed bug that deleted links

***

- let -> const

## v0.2.0

*2021-06-02*

- mixins with parameters
- added nested @-rule support

***

- you may now specify the output directory
- added option to minify the output
  - added option to create a source-map
- added option to read options from local config file
  - supported types: json, toml, yaml

## v0.1.2

*2021-06-01*

- added variable shortcut (`$pd` == `pd $pd`)

***

- temporarily removed support for config files
- updated cli design
- cli: added -v, --version and -h, --help
- updated readme.md
- fixed spelling mistake in import in readme.md

## v0.1.1

*2021-05-18*

- compile now only transforms strings
- old compile functionality now in cli.js

## v0.1.0

*2021-05-17*

- initial release
