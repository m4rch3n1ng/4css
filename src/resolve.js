import { lookup } from "./_lookup.js"

function resolveProperty ({ type, name, props, lineNumber }, top ) {
	let nName = lookup(name)
	props = props.map(( prop ) => {
		if (/^\$/.test(prop)) {
			let value = top.find(({ type, name: n }) => type == "VariableAssignment" && n == prop)

			if (!value) throw { message: `variable ${prop} does not exist`, lineNumber }

			return value.value
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
	let mix = top.find(({ type, name: n }) => type == "MixinDeclaration" && n == name)

	if (!mix) throw { message: `mixin ${name} does not exist.`, lineNumber }

	return resolveGroup(mix, top).properties
}

function resolveGroup ( group, top ) {
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
					resolveProperty(prop, top)
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

export default function resolve ( tokens ) {
	let resolved = []

	let index = 0
	while (index < tokens.length) {
		let token = tokens[index]

		switch (token.type) {
			case "Special": {
				resolved.push(token)
				break
			}
			case "Group": {
				resolved.push(
					resolveGroup(token, tokens.slice(0, index).reverse())
				)
				break
			}
		}

		index++
	}

	return resolved
}
