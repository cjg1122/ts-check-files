declare function tscf(args: {
    files: string[];
    cwd?: string;
    include?: string[];
    exclude?: string[];
}): void;

export { tscf as default };
