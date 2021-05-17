export default function parse ( flattened ) {
	let parsed = flattened.map(({ type, ...item }) => {
		if (type == "Special") {
			return `@${item.keyword} ${item.props};`
		}

		return [
			item.selectors.join(",\n") + " {",
			item.properties.map(({ name, props }) => `\t${name}: ${props.join(" ")};`),
			"}"
		].flat().join("\n")
	}).join("\n\n") + "\n"

	return parsed
}
