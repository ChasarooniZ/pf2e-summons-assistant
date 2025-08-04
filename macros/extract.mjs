#!/usr/bin/env node

import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { extractPack } from "@foundryvtt/foundryvtt-cli";
import { transformEntry } from "./transformer.mjs";
// import moduleJSON from "../module.json" with { type: "json" };

const foundryDataDir = "packs/";
const jsonDataDir = "data/";

const outDir = path.resolve(process.cwd());
const packsCompiled = path.resolve(outDir, foundryDataDir);
if (!existsSync(packsCompiled)) {
	console.error("Packs directory does not exist in the build!");
}

const packFolders = await fs.readdir(packsCompiled);

console.log("Cleaning Data Folder");

for (const pack of packFolders) {
	if (!existsSync(`${jsonDataDir}/${pack}`)) {
		await fs.mkdir(`${jsonDataDir}/${pack}`);
	}
	const files = await fs.readdir(`${jsonDataDir}/${pack}`, { withFileTypes: true });
	const jsonFiles = files
		.filter(f => f.isFile() && f.name.toLowerCase().endsWith(".json"))
		.map(f => f.name);
	for (const file of jsonFiles) {
		await fs.rm(path.resolve(jsonDataDir, pack, file));
	}
}

for (const pack of packFolders) {
	console.log(`Extracting pack: ${pack}`);
	await extractPack(
		path.resolve(packsCompiled, pack),
		`${jsonDataDir}/${pack}`,
		{ transformEntry },
	);
}

console.log("Extraction Complete");