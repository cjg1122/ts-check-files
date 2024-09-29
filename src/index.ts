import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { join } from "node:path";
import type { CompilerOptions } from "typescript";

interface TsConfig {
  compilerOptions: CompilerOptions;
  include?: string[];
  exclude?: string[];
  files?: string[];
}

function tscf(args: {
  files: string[];
  cwd?: string;
  include?: string[];
  exclude?: string[];
}) {
  const { files, cwd = process.cwd(), include = [], exclude = [] } = args;

  // 构建 tsconfig.json 文件的路径
  const tsconfigPath = join(cwd, "tsconfig.json");

  // 同步读取文件内容
  const fileContent = fs.readFileSync(tsconfigPath, "utf8");

  // 解析 JSON 字符串
  const tsconfig = JSON.parse(fileContent) as TsConfig;

  // 临时 config 文件内容
  const tsTmpConfig: TsConfig = {
    ...tsconfig,
    include,
    exclude,
    files,
  };

  const tsTmpConfigPath = join(cwd, ".tsconfig.tmp.json");

  fs.writeFileSync(
    tsTmpConfigPath,
    JSON.stringify(tsTmpConfig, null, 2),
    "utf8",
  );

  const result = spawnSync(
    "npx",
    ["--no-install", "tsc", "-p", tsTmpConfigPath],
    {
      stdio: "inherit",
    },
  );

  fs.unlinkSync(tsTmpConfigPath);

  if (result.status !== 0) {
    process.exit(result.status);
  }
}

export default tscf;
