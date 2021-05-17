#!/usr/bin/env node

import { readFileSync, watchFile } from "fs"
import { compile } from "../src/index.js"
import { recursive } from "../src/_functions.js"

let files = recursive(process.cwd()).filter(( file ) => file.endsWith(".4css"))

files.forEach(( path ) => {
	let file = readFileSync(path).toString()
	compile(file, path.slice(process.cwd().length + 1, -5).replace(/\\/g, "/"), process.cwd())

	if (process.argv.includes("-w") || process.argv.includes("--watch")) {
		watchFile(path, () => {
			let file = readFileSync(path).toString()
			compile(file, path.slice(process.cwd().length + 1, -5).replace(/\\/g, "/"), process.cwd())
		})
	}
})
