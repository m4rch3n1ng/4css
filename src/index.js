import { writeFileSync } from "fs"
import { default as tokenize } from "./tokenize.js"
import { default as resolve } from "./resolve.js"
import { default as flatten } from "./flatten.js"
import { default as parse } from "./parse.js"

import { error, status, success } from "./_functions.js"

export function compile ( file, name, path ) {
	let hName = `\x1b[47m${name}.4css\x1b[0m`

	console.log()
	status(`compiling ${hName}`)

	try {
		let tokens = tokenize(file)
		let resolved = resolve(tokens)
		let flattened = flatten(resolved)
		let parsed = parse(flattened)

		success(`compiled ${hName}`)
		writeFileSync(`${path}/${name}.css`, parsed.toString())
	} catch ({ message, lineNumber }) {
		if (lineNumber != undefined) {
			error(`${hName}, line ${lineNumber}: ${message}`)
		} else {
			error(`${hName}: ${message}`)
		}
	}
}

export { tokenize, resolve, flatten }

export default compile
