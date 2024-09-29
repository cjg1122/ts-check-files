export default function normalizeToArray(
  value: string | boolean | string[] | undefined,
) {
  return typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value
      : [];
}
