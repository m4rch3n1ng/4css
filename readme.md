# 4css

a compiler for a very specific flavour of css

# toc

- [4css](#4css)
- [toc](#toc)
- [general](#general)
- [syntax](#syntax)
- [variables](#variables)
- [mixins](#mixins)
- [lookup](#lookup)

# general

the general philosophy was to make css shorter, faster to write and less annoying

semicolons and colons may be emitted

blocks are defined by indentation rather than brackets

some values **may** be shortened, instead of having to write completely write them. consult the [lookup table](#lookup) on what values are able to be shortened

currently every .4css file directly in the target folder will be evaluated and 

# syntax

```stylus
*
	mg 0
	pd 10px
```

# variables

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

# mixins

mixins are declared with a percent sign and can be mixed into your templates with the same sign

```stylus
%mix
	bg #f2f2f2
	bd 2px solid teal

div
	%mix
	cl red
```

# lookup

- mg: margin
- pd: padding
- cl: color
- bg: background
- bd: border
- p: position
- d: display
