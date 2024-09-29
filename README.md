## 安装

```sh
npm install ts-check-files -D
```

## cli

### 1. 语法

```
tscf [<file> <glob> ...] [--files <file> <glob> ...] [--cwd <directory>] [--include <file> <glob> ...] [--exclude <file> <glob> ...]
```

直接指定的文件跟通过 --files 参数指定文件最后会合并

### 2. 使用

```sh
tscf src/a.ts src/b.ts --include src/**/*.d.ts --exclude src/**/*/test.*
```

## nodejs api

### 1. 类型声明

```ts
declare function tscf(args: {
  files: string[];
  cwd?: string;
  include?: string[];
  exclude?: string[];
}): void;
```

### 2. 使用

```ts
import tscf from "ts-check-files";

tscf({
  files: ["a.js", "b.js"],
  cwd: "./",
  include: ["src/**/*.d.ts"],
  exclude: ["src/**/*.test.{js,ts}"],
});
```

## 建议&说明

1. 建议把 .tsconfig.tmp.json（临时文件） 添加到 .gitignore
2. --include 如果想直接指定 glob 可以 `--include 'src/**/*.ts'`, 否则终端会返回查寻列表（exclude 同理）
3. 直接指定文件与 --files 不支持 glob 模式 `tscf '*.ts' --files '*.tsx'`, 可以`tscf *.ts --files *.tsx`
