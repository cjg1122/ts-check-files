# tscf

结合 lint-staged 使用 Typescript Compiler API 对 git 改动的文件进行类型检测

## 使用

### 1. lint-staged

.lintstagedrc.json

```json
{
  "*.ts?(x)": "tscf"
}
```

### 2. lefthook

lefthook.yaml

```yaml
pre-commit:
  parallel: true
  commands:
    tsc:
      glob: "*.{ts,tsx}"
      run: npx --no-install tscf {staged_files}
```

## 安装

```sh
npm install ts-check-files -D
```

## cli

### 1. 语法

```
tscf [<file> <glob> ...] [--cwd <directory>]
```

### 2. 使用

```sh
tscf src/a.ts src/b.ts
```

## nodejs api

### 1. 类型声明

```ts
declare function tscf(args: {
  files: string[];
  cwd?: string;
}): Promise<[null, string] | [string, null]>;
```

### 2. 使用

```ts
import tscf from "ts-check-files";

const [error, message] = await tscf({
  files,
  cwd,
});

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(message);
```
