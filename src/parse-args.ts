export type ParsedArgs = {
  [key: string]: string | boolean | string[];
  _: string[];
};

export default function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    _: [],
  };

  let currentKey: string | null = null;

  for (const arg of argv) {
    if (arg.startsWith("--")) {
      currentKey = arg.slice(2);
      args[currentKey] = true;
    } else if (arg.startsWith("-")) {
      currentKey = arg.slice(1);
      args[currentKey] = true;
    } else {
      if (currentKey) {
        if (args[currentKey] === true) {
          args[currentKey] = arg;
        } else if (Array.isArray(args[currentKey])) {
          (args[currentKey] as string[]).push(arg);
        } else {
          args[currentKey] = [args[currentKey] as string, arg];
        }
      } else {
        args._.push(arg);
      }
    }
  }

  return args;
}
