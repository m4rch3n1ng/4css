import { existsSync, lstatSync, readdirSync, readFileSync } from "fs"
import { join } from "path"

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

export function notice ( message ) {
	console.log(`4css\x1b[36m!notice\x1b[0m ${message}`)
}

export function success ( message ) {
	console.log(`4css\x1b[32m!success\x1b[0m ${message}`)
}

// export function warn ( message ) {
// 	console.log(`4css\x1b[33m!warn\x1b[0m ${message}`)
// }

export function error ( message ) {
	console.log(`4css\x1b[31m!error\x1b[0m ${message}`)
}
