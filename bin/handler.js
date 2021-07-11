import { join } from "path"
import { existsSync, mkdirSync, readFileSync, watchFile, writeFileSync } from "fs"
import { compile } from "../src/index.js"
import { recursive, getConfig, terse, notice, success, warn, error } from "../src/_utils.js"

export default async function handler ( dirPath, outPath, options ) {
	const { dir, out, config } = getConfig(dirPath, outPath, options)

	const files = recursive(dir).filter(( path ) => /[^\/\\]\.4css$/.test(path))
	files.forEach(( path ) => {
		write({ path, dir, out, config })

		if (options.watch) watchFile(path, () => write({ path, dir, out, config }))
	})
}

function write ({ path, out, dir, config }) {
	const file = readFileSync(path).toString()

	const name = path.slice(dir.length + 1, -5).replace(/\\/g, "/")
	const hName = `\x1b[3m${name}.4css\x1b[0m`

	const outFile = join(out, `${name}.css`)
	const [, outFolder = "." ] = /^(.+)[\\\/][^\/\\]+$/.exec(outFile) || []
	if (!existsSync(outFolder)) mkdirSync(outFolder)

	console.log()
	notice(`compiling ${hName}`)

	try {
		if (config.terse) {
			const { sourceMap, css, warnings } = terse(compile(file), !!config.sourceMap)

			warnings.forEach(( warning ) => warn(warning.replace(/^\w/, ( c ) => c.toLowerCase())))

			if (sourceMap) writeFileSync(join(out, `${name}.css.map`), sourceMap)
			writeFileSync(outFile, css)
		} else {
			const css = compile(file)

			writeFileSync(outFile, css)
		}

		success(`compiled ${hName}`)
	} catch ({ message, lineNumber }) {
		if (lineNumber != undefined) {
			error(`${hName}, line ${lineNumber}: ${message}`)
		} else {
			error(`${hName}: ${message}`)
		}
	}
}
