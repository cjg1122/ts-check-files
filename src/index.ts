import path from "node:path";
import ts from "typescript";

async function tscf(args: {
  files: string[];
  cwd?: string;
}): Promise<[null, string] | [string, null]> {
  const { files = [], cwd = process.cwd() } = args;

  if (files.length === 0) {
    return [null, "No files to check."];
  }

  // 读取 tsconfig.json 文件
  const configPath = path.resolve(cwd, "tsconfig.json");
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  if (configFile.error) {
    const message = ts.flattenDiagnosticMessageText(
      configFile.error.messageText,
      "\n",
    );
    return [`Error reading tsconfig.json: ${message}`, null];
  }

  // 解析 tsconfig.json
  const parsedCommandLine = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
  );

  const rootNames = [
    ...files,
    ...parsedCommandLine.fileNames.filter((file) => file.endsWith(".d.ts")),
  ];

  // 创建 TypeScript 程序
  const program = ts.createProgram({
    rootNames,
    options: parsedCommandLine.options,
  });

  // 获取并打印所有诊断信息
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length === 0) {
    return [null, "No type errors found."];
  }

  const errorMessages = diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n",
    );

    let errorDetails = [`Message: ${message}`];

    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        diagnostic.start!,
      );
      const fileName = diagnostic.file.fileName;
      const sourceText = diagnostic.file.text.split("\n")[line];

      errorDetails = [
        `Error in ${fileName} (${line + 1},${character + 1}):`,
        `  ${sourceText.trim()}`,
        `  ${" ".repeat(character)}^`,
        `  Message: ${message}`,
      ];
    }

    // if (diagnostic.code) {
    //   errorDetails.push(`  Error Code: TS${diagnostic.code}`);
    // }

    // if (diagnostic.category) {
    //   const category = ts.DiagnosticCategory[diagnostic.category];
    //   errorDetails.push(`  Category: ${category}`);
    // }

    // // Optionally, add suggestions or links to documentation
    // if (diagnostic.code === 2322) {
    //   errorDetails.push(
    //     "  Suggestion: Check type assignments and ensure compatibility.",
    //   );
    // }

    return `${errorDetails.join("\n")}\n`;
  });

  return [errorMessages.join("\n"), null];
}

export default tscf;
