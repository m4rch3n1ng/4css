import { join, resolve } from "path"
import { watchFile, readFileSync, writeFileSync } from "fs"
import { compile } from "../src/index.js"
import { recursive, success, error, notice } from "../src/_utils.js"

export default async function handler ( path = ".", options ) {
	let dir = resolve(join(process.cwd(), path))

	let files = recursive(dir).filter(( path ) => /[^\/\\]\.4css$/.test(path))

	files.forEach(( file ) => {
		write(file, dir)

		if (options.watch) watchFile(file, () => write(file, dir))
	})
}

function write ( path, dir ) {
	let file = readFileSync(path).toString()

	let name = path.slice(dir.length + 1, -5).replace(/\\/g, "/")
	let hName = `\x1b[3m${name}.4css\x1b[0m`

	console.log()
	notice(`compiling ${hName}`)

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
