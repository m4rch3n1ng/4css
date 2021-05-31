#!/usr/bin/env node

import sade from "sade"
import handler from "./_handler.js"

sade("4css [dir]")
	.describe("compile 4css to valid css")
	.version("v0.1.2")
	.option("-w, --watch", "listen for file change", false)
	.example("src -w")
	.example("src")
	.example("styles")
	.action(handler)
	.parse(process.argv)
