function parser ( flattened, level ) {
	let parsed = flattened.map(({ type, ...item }) => {
		switch (type) {
			case "RegularAt": {
				return `${"\t".repeat(level)}@${item.name} ${item.rule};`
			}
			case "NestedAt": {
				return [
					`@${item.name}${item.rule ? ` ${item.rule}` : ""} {`,
					parser(item.tokens, 1),
					"}"
				].join("\n")
			}
			case "Group": {
				return [
					item.selectors.map(( sel ) => "\t".repeat(level) + sel).join(",\n") + " {",
					item.properties.map(({ name, props }) => `${"\t".repeat(level + 1)}${name}: ${props.join(" ")};`),
					`${"\t".repeat(level)}}`
				].flat().join("\n")
			}
		}
	})

	return parsed.join("\n\n")
}

export default function parse ( flattened ) {
	return parser(flattened, 0) + "\n"
}
