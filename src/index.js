import { default as tokenize } from "./tokenize.js"
import { default as resolve } from "./resolve.js"
import { default as flatten } from "./flatten.js"
import { default as parse } from "./parse.js"

export function compile ( file ) {
	let tokens = tokenize(file)
	let resolved = resolve(tokens)
	let flattened = flatten(resolved)
	let parsed = parse(flattened)

	return parsed
}

export { tokenize, resolve, flatten }

export default compile
