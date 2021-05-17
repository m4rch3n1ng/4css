import { readdirSync, lstatSync, existsSync } from "fs"
import { join } from "path"

export function recursive ( path ) {
	let files = []
	let folders = []

	r(path)

	if (typeof callback == "function") callback(files, folders)
	return files

	function r (path) {
		let all = readdirSync(path)
		let current = all.filter(( item ) => lstatSync(join(path, item)).isDirectory()).filter(( folder ) => folder != "node_mdoules")

		files = files.concat(all.filter(( file ) => !lstatSync(join(path, file)).isDirectory()).map(( file ) => join(path, file)))
		folders = folders.concat(current.map(( file ) => join(path, file)))

		for (let folder of current) {
			r(join(path, folder))
		}
	}
}

export function status ( message ) {
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
