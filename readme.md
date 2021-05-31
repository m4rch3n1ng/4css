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
	-w, --watch: watch for changes in files
```

# api

you can get the compile function by importing it from the library

## compile

```js
import { compile } from "@m4rch/4css"
// or
import compile from "@m4rch/4css"

// get the code

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
