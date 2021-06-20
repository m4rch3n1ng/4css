import { existsSync, lstatSync, readdirSync, readFileSync } from "fs"
import { join, resolve } from "path"
import CleanCSS from "clean-css"
import toml from "@iarna/toml"
import yaml from "yaml"

export function recursive ( path ) {
	if (!existsSync(path) || !lstatSync(path).isDirectory()) return []

	let files = []
	;(function r ( path ) {
		let all = readdirSync(path)

		files = files.concat(
			all.filter(( file ) => !lstatSync(join(path, file)).isDirectory()).map(( file ) => join(path, file))
		)

		all
			.filter(( file ) => lstatSync(join(path, file)).isDirectory())
			.filter(( folder ) => folder != "node_modules" && !folder.startsWith("."))
			.forEach(( folder ) => r(join(path, folder)))
	}(path))

	return files
}

export function getConfig ( dirPath, outPath, options ) {
	let file = options.config ? getConfigFile(options.config) : {}

	if (file.dir && dirPath) warn("ignoring given dir, using config file")
	if (file.out && outPath) warn("ignoring given out, using config file")
	if ("terse" in file && options.terse) warn("ignoring --terse, using config file")
	if ("sourceMap" in file && options.s) warn("ignoring --source-map flag, using config file")
	
	let dir = resolve(join(process.cwd(), file.dir || dirPath || "."))
	let out = file.out || outPath ? join(process.cwd(), file.out || outPath) : dir
	
	let config = {
		terse: "terse" in file ? file.terse : options.terse,
		sourceMap: "sourceMap" in file ? file.sourceMap : options.terse
	}

	if (!config.terse && config.sourceMap) warn("ignoring --source-map option as --terse is not set")

	return {
		dir,
		out,
		config
	}
}

function getConfigFile ( path ) {
	try {
		let actual = typeof path == "string"
			? path
			: [ "4css.config.json", "4css.config.toml", "4css.config.yaml", "4css.config.yml" ].find(( f ) => existsSync(join(process.cwd(), f))) || null
		if (!actual || !existsSync(join(process.cwd(), actual))) throw { message: "(provided) config file does not exist" }

		let [, ext = null ] = /\.([^\/\\\.]+)$/.exec(actual) || []
		if (!ext || ![ "json", "toml", "yaml", "yml" ].includes(ext)) {
			throw { message: "given config file either has no or an invalid extension. valid extensions are .json, .toml, .yaml, .yml" }
		}

		let file = readFileSync(join(process.cwd(), actual)).toString()

		switch (ext) {
			case "json": {
				return JSON.parse(file)
			}
			case "toml": {
				return toml.parse(file)
			}
			case "yaml":
			case "yml": {
				return yaml.parse(file)
			}
		}
	} catch ({ message }) {
		error(message)
		process.exit()
	}
}

export function terse ( css, sourceMap ) {
	let minifed = new CleanCSS({ sourceMap }).minify(css)

	return {
		css: minifed.styles + "\n",
		warnings: minifed.errors.concat(minifed.warnings),
		sourceMap: minifed.sourceMap?.toString()
	}
}

export function notice ( message ) {
	console.log(`4css\x1b[36m!notice\x1b[0m ${message}`)
}

export function success ( message ) {
	console.log(`4css\x1b[32m!success\x1b[0m ${message}`)
}

export function warn ( message ) {
	console.log(`4css\x1b[33m!warn\x1b[0m ${message}`)
}

export function error ( message ) {
	console.log(`4css\x1b[31m!error\x1b[0m ${message}`)
}
