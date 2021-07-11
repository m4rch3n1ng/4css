#!/usr/bin/env node

import sade from "sade"
import handler from "./handler.js"

sade("4css [dir] [out]")
	.describe("compile 4css to valid css")
	.version("v0.2.1")
	.option("-w, --watch", "listen for file change")
	.option("-t, --terse", "minify css")
	.option("-s, --source-map", "create sourcemap (only with --terse)")
	.option("-c, --config", "specify a config file")
	.example("-c -w")
	.example("src dist -ts")
	.example("styles")
	.action(handler)
	.parse(process.argv)
