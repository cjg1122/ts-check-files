#!/usr/bin/env node

import tscf from "./index";
import normalizeToArray from "./normalizeToArray";
import parsedArgs from "./parse-args";

const args = parsedArgs(process.argv.slice(2));
const files = [...args._, ...normalizeToArray(args.files)];
const include = normalizeToArray(args.include);
const exclude = normalizeToArray(args.exclude);
const cwd = typeof args.cwd === "string" ? args.cwd : process.cwd();

if (files.length === 0) {
  console.log("tscf: No files to check");
  process.exit(0);
}

tscf({
  files,
  cwd,
  include,
  exclude,
});
