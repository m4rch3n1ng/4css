function resolveMixinParameters ( unparsed, lineNumber ) {
	if (!unparsed) return []
	unparsed = unparsed.replace(/^\(?\s+|\s+\)?$/g, "")

	let params = []

	const parsed = unparsed.split(/\s+/g).map(( el ) => el.split(/\s*(,|=)\s*/)).flat().filter(( el ) => el.length)
	parsed.forEach(( param, i ) => {
		const last = parsed[i - 1]
		if (!last && /[,=]/.test(param)) throw { message: `parameters may not start with ${param}`, lineNumber }

		if (param.startsWith("$")) {
			if (!/^\$[a-z][a-z0-9]*$/.test(param)) throw { message: "malformed variable in mixin parameters", lineNumber }
			if (last && last == "=") throw { message: "cannot assign default variable to a variable", lineNumber }

			params.push([ param ])
		} else if (!/[,=]/.test(param)) {
			if (!params.length) throw { message: "cannot set a default value if no variable has been declared in mixin parameters", lineNumber }
			if (!/[,=]/.test(last) && !/^\$[a-z][a-z0-9]*$/.test(last)) throw { message: "default may only be one value", lineNumber }
			if (last == ",") throw { message: "comma cannot follow before default value declaration", lineNumber }

			params[params.length - 1][1] = param
		}
	})

	return params
}

function createSelectors ( lines, index, level ) {
	let selectors = []

	while (!lines[index]?.line.startsWith("\t".repeat(level + 1))) {
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
	const indentation = "\t".repeat(level)

	while (lines[index] && lines[index].line.startsWith(indentation)) {
		let { line, lineNumber } = lines[index]
		line = line.trim()

		if (line.startsWith("%")) {
			const match = /^\% *([a-z][a-z0-9]*) *(\(.+\)|.+)? *$/i.exec(line)
			if (!match) throw { message: "malformed mixin", lineNumber }

			let [, name, args = "" ] = match
			args = args.replace(/^\(\s*|\s*\)$/g, "").split(/[, ]+/g).filter(( arg ) => arg.length)

			property.push({
				type: "UseMixin",
				name,
				args,
				lineNumber
			})

			index++
		} else if (line.startsWith("&")) {
			if (!/^& *[^ ]+.*$/.test(line)) throw { message: "malformed extend stuff", lineNumber }
			const [, selectors ] = /^& *(.+)$/.exec(line)

			const { index: pIndex, properties: props } = createProperties(lines, index + 1, level + 1)
			index = pIndex

			property.push({
				type: "Extend",
				kind: /^&[^ ]/.test(line) ? "append": "sub",
				selectors: selectors.split(/ +/g).join(" ").split(/ *,+ */g),
				properties: props,
				lineNumber
			})
		} else {
			const match = /^([a-z\-]+) *[: ] *(.+?);?$|^(\$[a-z][a-z0-9]*)( +.+)?$/gi.exec(line)
			if (!match) throw { message: "malformed property", lineNumber }

			const [, regular, regularProps, shortcut, shortcutProps ] = match
			if (!shortcut) {
				const props = regularProps.trim().split(/ +/g)

				property.push({
					type: "Property",
					name: regular,
					props,
					lineNumber
				})
			} else {
				const props = shortcutProps?.trim() ? shortcutProps.trim().split(/ +/g) : []

				property.push({
					type: "Property",
					name: shortcut.slice(1),
					props: [ shortcut, ...props ],
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

const regularAt = [ "charset", "import", "namespace" ]

function createGroups ( lines, index, level ) {
	const tokens = []

	while (index < lines.length && lines[index].line.startsWith("\t".repeat(level))) {
		let { line, lineNumber } = lines[index]
		line = line.slice(level)

		if (/^\$/.test(line)) {
			const match = /^(?<name>\$[a-z][a-z0-9]*)( *= *| +)(?<value>.+) *$/i.exec(line)?.groups
			if (!match) throw { message: "malformed variable assignment", lineNumber }

			tokens.push({
				type: "VariableAssignment",
				...match,
				lineNumber
			})

			index++
		} else if (/^%/.test(line)) {
			const match = /^\% *([a-z][a-z0-9]*) *([^()]+|\(.+\))? *$/i.exec(line)
			if (!match) throw { message: "malformed mixin declaration", lineNumber }

			const [, name, params ] = match
			const parameters = resolveMixinParameters(params)

			const { index: pIndex, properties } = createProperties(lines, index + 1, 1)
			index = pIndex

			tokens.push({
				type: "MixinDeclaration",
				name,
				parameters,
				properties,
				lineNumber
			})
		} else if (/^@/.test(line)) {
			const match = /^@([a-z\-]+)/i.exec(line)
			if (!match) throw { message: "malformed @-rule", lineNumber }

			const [, name ] = match
			if (regularAt.includes(name)) {
				const rMatch = /^@[a-z\-]+ +(.+);?\w*$/i.exec(line)
				if (!rMatch) throw { message: "malformed @-rule", lineNumber }

				const [, rule ] = rMatch

				tokens.push({
					type: "RegularAt",
					name,
					rule: rule.trim(),
					lineNumber
				})

				index++
			} else {
				let [, rule ] = /^@[^ ]+ +(.+)?/i.exec(line) || []

				let { tokens: nTokens, index: nIndex } = createGroups(lines, index + 1, level + 1)
				index = nIndex

				tokens.push({
					type: "NestedAt",
					name,
					rule,
					tokens: nTokens,
					lineNumber
				})
			}
		} else {
			const { index: sIndex, selectors } = createSelectors(lines, index, level)
			index = sIndex

			const { index: pIndex, properties } = createProperties(lines, index, level + 1)
			index = pIndex

			tokens.push({
				type: "Group",
				selectors,
				properties,
				lineNumber
			})
		}
	}

	return {
		tokens,
		index
	}
}

export default function tokenize ( file ) {
	const lines = file
		.split(/\r?\n/g)
		.map(( line ) => line.replace(/\/\/(?=([^'"\\]*(\\.|("([^"\\]*\\.)*[^"\\]*"|'([^'\\]*\\.)*[^'\\]*')))*[^"']*$).*/, ""))
		.map(( line ) => line.trimEnd())
		.map(( line, number ) => ({ line, lineNumber: number + 1 }))
		.filter(({ line }) => line)

	const { tokens } = createGroups(lines, 0, 0)

	return tokens
}
