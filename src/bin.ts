#!/usr/bin/env node

import { resolve } from "node:path";
import tscf from "./index";
import normalizeToArray from "./normalize-to-array";
import parsedArgs from "./parse-args";

const args = parsedArgs(process.argv.slice(2));
const files = [...args._, ...normalizeToArray(args.files)].map((file) =>
  resolve(file),
);
const cwd = typeof args.cwd === "string" ? args.cwd : void 0;

const [error, message] = await tscf({
  files,
  cwd,
});

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(message);
