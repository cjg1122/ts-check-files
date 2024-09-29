import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/index.ts", "src/bin.ts"],
    format: ["esm"],
    minify: !options.watch,
    dts: true,
    splitting: false,
    clean: true,
    shims: true,
  };
});
