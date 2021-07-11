import { lookup } from "./_lookup.js"
import { warn } from "./_utils.js"

function resolveArgs ( params, args, lineNumber ) {
	if (args.length > params.length) warn(`line: ${lineNumber}: expected ${params.length} arguments but got ${args.length}`)

	let resolved = {}
	params.forEach(([ param, def ], i) => {
		if (!def && !args[i]) throw { message: `expected ${i} or more arguments but got only ${args.length}`, lineNumber }

		resolved[param] = args[i] || def
	})

	return resolved
}

function resolveProperty ({ type, name, props, lineNumber }, top, args = {} ) {
	const nName = lookup(name)
	props = props.map(( prop ) => {
		if (/^\$/.test(prop)) {
			const value = args[prop] || top.find(({ type, name: n }) => type == "VariableAssignment" && n == prop)?.value
			if (!value) throw { message: `variable ${prop} does not exist`, lineNumber }

			return value
		} else return prop
	})

	return {
		type,
		name: nName,
		props,
		lineNumber
	}
}

function resolveMixin ({ name, args, lineNumber }, top ) {
	const mix = top.find(({ type, name: n }) => type == "MixinDeclaration" && n == name)
	if (!mix) throw { message: `mixin ${name} does not exist.`, lineNumber }

	const resolved = resolveArgs(mix.parameters, args, lineNumber)

	return resolveGroup(mix, top, resolved).properties
}

function resolveGroup ( group, top, args = {} ) {
	let { properties, ...rest } = group

	let nProps = []
	let extend = []
	properties.forEach(( prop ) => {
		switch (prop.type) {
			case "UseMixin": {
				nProps = nProps.concat(
					resolveMixin(prop, top)
				)

				break
			}
			case "Property": {
				nProps.push(
					resolveProperty(prop, top, args)
				)

				break
			}
			case "Extend": {
				extend.push(
					resolveGroup(prop, top)
				)
			}
		}
	})

	return {
		...rest,
		properties: nProps,
		extend
	}
}

export default function resolve ( tokens, top ) {
	let resolved = []

	let index = 0
	while (index < tokens.length) {
		const token = tokens[index]

		switch (token.type) {
			case "RegularAt": {
				resolved.push(token)
				break
			}
			case "NestedAt": {
				const { tokens: nTokens, ...rest } = token

				resolved.push({
					...rest,
					tokens: resolve(nTokens, top ?? tokens.slice(0, index).reverse())
				})

				break
			}
			case "Group": {
				resolved.push(
					resolveGroup(token, top ?? tokens.slice(0, index).reverse())
				)
				break
			}
		}

		index++
	}

	return resolved
}
