<!-- omit in toc -->
# 4css

a compiler for a very specific flavour of css

<!-- omit in toc -->
# toc

- [general](#general)
	- [philosophy](#philosophy)
	- [syntax](#syntax)
	- [variables](#variables)
	- [variable shortcuts](#variable-shortcuts)
	- [mixins](#mixins)
	- [lookup](#lookup)
- [cli](#cli)
	- [flags](#flags)
- [api](#api)
	- [compile](#compile)
	- [handler](#handler)

# general

## philosophy

the general philosophy was to make css shorter, faster to write and less annoying

semicolons and colons may be emitted

blocks are defined by indentation rather than brackets

some values **may** be shortened, instead of having to write completely write them. consult the [lookup table](#lookup) on what values are able to be shortened

## syntax

```stylus
*
	mg 0
	pd 10px
```

## variables

variables may be declared using `$name = value`

```stylus
$color = teal

.test
div
	bg $color
```

because variables have to be declared using a dollar sign the equals sign may be omitted

```stylus
$width 10px

.rectangle
	height 5px
	width $width
```

## variable shortcuts

```stylus
$width 10px
$height 5px

.rectangle
	$width
	$height
```

is equivalent to

```stylus
$width 10px
$height 5px

.rectangle
	width $width
	height $height
```

## mixins

mixins are declared with a percent sign and can be mixed into your templates with the same sign

```stylus
%mix
	bg #f2f2f2
	bd 2px solid teal

div
	%mix
	cl red
```

## lookup

- mg: margin
- pd: padding
- cl: color
- bg: background
- bd: border
- p: position
- d: display

# cli

```
$ 4css
```

## flags

current flags are

```
    -w, --watch         listen for file change
    -t, --terse         minify css
    -s, --source-map    create sourcemap [only with --terse]
    -c, --config        specify a config file
```

<!-- omit in toc -->
### watch

recompile whenever a 4css-file gets changed

limitation (currently): newly created files don't get compile while watching

<!-- omit in toc -->
### config [file]

if you dont wan't to always specify all your entire configuration you can create a config file in your working directory

if you want the 4css cli to read and recognize your file you either have to specify your own file using `-c your-file` (valid file extensions are .json, .toml, .yaml, .yml). if no file is specified then it will try to parse, in order, 4css.config.json -> 4css.config.toml -> 4css.config.yaml -> 4css.config.yml. if no file exists an error is thrown

<!-- omit in toc -->
### terse

output css is minified and slightly optimised, resulting in better speed but less readability

<!-- omit in toc -->
### source-map

**only works in combination with --terse**

creates a source-map file with every generated css file

# api

you can get the compile function by importing it from the library

## compile

```js
import { compile } from "@m4rch/4css"

/*
	get the code
*/

let compiled = compile(code)
```

the only argument compile takes is a string of the source code for a *.4css* file and it returns valid css

compile itself consists of four seperate functions, each exported too

the four functions, in order, take the value of the one prior to them or, if no prior function exists, the raw source code, just like compile itself

the four functions are

- **tokenize**
- **resolve**
- **flatten**
- **parse**

## handler

you can also import the handler used for the cli

```js
import handler from "@m4rch/4css/handler"
```

the handler is a function that takes 3 arguments:

- `dir`
- `out`
- `options`

`dir` is a string that specifies the directory from which you want to compile (optional, default: ".")

`out` is a string that specifies the directory to which you want to compile (optional, default: dir)

`options` is an object containing the [flags](#flags)
