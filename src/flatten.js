function flattenExtend ( extend, groupSelectors ) {
	return extend.map(({ type, kind, selectors: extendSelectors, ...group }) => {
		let selectors = groupSelectors.map(( gSel ) => extendSelectors.map(( eSel ) => `${gSel}${kind == "append" ? "" : " "}${eSel}`)).flat()

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
		if (item.type != "Group") {
			return flattened.push(item)
		}

		let { extend, ...group } = item

		flattened.push({
			...group,
			extend: []
		})

		if (extend.length) {
			let more = flattenExtend(extend, group.selectors)

			flattened = flattened.concat(more)
		}
	})

	return flattened
}

export default function flatten ( resolved ) {
	while (resolved.filter(({ extend }) => extend?.length).length) {
		resolved = flattenOnce(resolved)
	}

	return resolved
}
