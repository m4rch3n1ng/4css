function createSelectors ( lines, index ) {
	let selectors = []

	while (!lines[index].line.startsWith("\t")) {
		let selector = lines[index].line.trim().replace(/,+$/, "").split(/,/).map(( selector ) => selector.trim()).filter(( selector ) => selector)
		selectors.push(...selector)

		index++
	}

	return {
		selectors,
		index
	}
}

function createProperties ( lines, index, level ) {
	let property = []
	let indentation = Array(level).fill("\t").join("")

	while (lines[index] && lines[index].line.startsWith(indentation)) {
		let { line, lineNumber } = lines[index]
		line = line.trim()

		if (line.startsWith("%")) {
			let match = /^\% *(?<name>[a-z][a-z0-9]*) *(\((?<args>.+)\))? *$/i.exec(line)?.groups

			if (!match) throw { message: "malformed mixin", lineNumber }

			let { name, args = "" } = match
			args = args.trim().split(/[, ]+/g).filter(( arg ) => arg.length)

			property.push({
				type: "UseMixin",
				name,
				args,
				lineNumber
			})

			index++
		} else if (line.startsWith("&")) {
			if (!/^& *[^ ]+.*$/.test(line)) throw { message: "malformed extend stuff", lineNumber }

			let [, selectors ] = /^& *(.+)$/.exec(line)

			let { index: pIndex, properties: props } = createProperties(lines, index + 1, level + 1)
			index = pIndex

			property.push({
				type: "Extend",
				kind: /^&[^ ]/.test(line) ? "append": "sub",
				selectors: selectors.split(/ +/g).join(" ").split(/ *,+ */g),
				properties: props,
				lineNumber
			})
		} else {
			let match = /^([a-z\-]+) *[: ] *(.+?);?$|^(\$[a-z][a-z0-9]*)$/gi.exec(line)

			if (!match) throw { message: "malformed property", lineNumber }

			let [, name, props, single ] = match
			if (!single) {
				props = props.trim().split(/ +/g)
				
				property.push({
					type: "Property",
					name,
					props,
					lineNumber
				})
			} else {
				property.push({
					type: "Property",
					name: single.slice(1),
					props: [ single ],
					lineNumber
				})
			}

			index++
		}
	}

	return {
		index,
		properties: property
	}
}

export default function tokenize ( file ) {
	let lines = file.split(/\r?\n/g).map(( line ) => line.trimEnd()).map(( line, number ) => ({ line, lineNumber: number + 1 })).filter(({ line }) => line)

	let tokens = []

	let index = 0
	while (index < lines.length) {
		let { line, lineNumber } = lines[index]

		if (/^\$/.test(line)) {
			let match = /^(?<name>\$[a-z][a-z0-9]*)( *= *| +)(?<value>.+) *$/i.exec(line)?.groups

			if (!match) throw { message: "malformed variable assignment", lineNumber }

			tokens.push({
				type: "VariableAssignment",
				...match,
				lineNumber
			})

			index++
		} else if (/^%/.test(line)) {
			let match = /^\% *(?<name>[a-z][a-z0-9]*)/i.exec(line)?.groups

			if (!match) throw { message: "malformed mixin declaration", lineNumber }

			let { index: pIndex, properties } = createProperties(lines, index + 1, 1)
			index = pIndex

			tokens.push({
				type: "MixinDeclaration",
				name: match.name,
				properties,
				lineNumber
			})
		} else if (/^@/.test(line)) {
			let match = /^@(?<keyword>[a-z]+) *(?<props>.+)? *$/i.exec(line)?.groups

			if (!match) throw { message: "malformed special stuff", lineNumber }

			tokens.push({
				type: "Special",
				...match,
				lineNumber
			})

			index++
		} else {
			let { index: sIndex, selectors } = createSelectors(lines, index)
			index = sIndex

			let { index: pIndex, properties } = createProperties(lines, index, 1)
			index = pIndex

			tokens.push({
				type: "Group",
				selectors,
				properties,
				lineNumber
			})
		}
	}

	return tokens
}
