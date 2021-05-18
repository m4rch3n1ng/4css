#!/usr/bin/env node

import { resolve, join } from "path"
import { readFileSync, watchFile, writeFileSync } from "fs"
import { compile } from "../src/index.js"
import { recursive, getConfig, error, status, success } from "../src/_functions.js"

let config = getConfig(join(process.cwd(), "4css.config.json"))

let dir = resolve(join(process.cwd(), config.src || "."))
let files = recursive(dir).filter(( file ) => file.endsWith(".4css"))

files.forEach(( path ) => {
	write(path, dir)

	if (process.argv.includes("-w") || process.argv.includes("--watch")) {
		watchFile(path, () => write(path, dir))
	}
})

function write ( path, dir ) {
	let file = readFileSync(path).toString()

	let name = path.slice(dir.length + 1, -5).replace(/\\/g, "/")
	let hName = `\x1b[3m${name}.4css\x1b[0m`

	console.log()
	status(`compiling ${hName}`)

	try {
		let css = compile(file)

		success(`compiled ${hName}`)
		writeFileSync(join(dir, `${name}.css`), css)
	} catch ({ message, lineNumber }) {
		if (lineNumber != undefined) {
			error(`${hName}, line ${lineNumber}: ${message}`)
		} else {
			error(`${hName}: ${message}`)
		}
	}
}
