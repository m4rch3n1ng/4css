import { default as tokenize } from "./tokenize.js"
import { default as resolve } from "./resolve.js"
import { default as flatten } from "./flatten.js"
import { default as parse } from "./parse.js"

import { writeFile } from "fs/promises"

export function compile ( file ) {
	const tokens = tokenize(file)
	writeFile("test/tokens.json", JSON.stringify(tokens, null, "\t"))
	const resolved = resolve(tokens)
	writeFile("test/resolved.json", JSON.stringify(resolved, null, "\t"))
	const flattened = flatten(resolved)
	writeFile("test/resolved.json", JSON.stringify(flattened, null, "\t"))

	const parsed = parse(flattened)

	return parsed
}

export { tokenize, resolve, flatten }

export default compile
