function flattenExtend ( extend, groupSelectors ) {
	return extend.map(({ type, kind, selectors: extendSelectors, ...group }) => {
		const selectors = groupSelectors.map(( gSel ) => extendSelectors.map(( eSel ) => `${gSel}${kind == "append" ? "" : " "}${eSel}`)).flat()

		return {
			type: "Group",
			selectors,
			...group
		}
	})
}

function flattenOnce ( resolved ) {
	let flattened = []

	resolved.forEach(( item ) => {
		switch (item.type) {
			case "Group": {
				const { extend, ...group } = item

				flattened.push({
					...group,
					extend: []
				})

				if (extend.length) {
					const more = flattenExtend(extend, group.selectors)

					flattened.push(...more)
				}
				break
			}
			default: {
				flattened.push(item)
			}
		}
	})

	return flattened
}

export default function flatten ( resolved ) {
	resolved = resolved.map(({ tokens, ...item }) => {
		if (tokens) {
			return {
				...item,
				tokens: flatten(tokens)
			}
		} else {
			return item
		}
	})

	while (resolved.filter(({ extend }) => extend?.length).length) {
		resolved = flattenOnce(resolved)
	}

	return resolved
}
