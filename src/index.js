import { default as tokenize } from "./tokenize.js"
import { default as resolve } from "./resolve.js"
import { default as flatten } from "./flatten.js"
import { default as parse } from "./parse.js"

export function compile ( file ) {
	const tokens = tokenize(file)
	const resolved = resolve(tokens)
	const flattened = flatten(resolved)
	const parsed = parse(flattened)

	return parsed
}

export { tokenize, resolve, flatten }

export default compile
