export function parseBrazilianMoney(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return Number.NaN;
  }

  const normalizedValue = value
    .trim()
    .replace(/\s/g, "")
    .replace(/^R\$/, "");

  if (!normalizedValue) {
    return Number.NaN;
  }

  let numericValue = normalizedValue;

  if (normalizedValue.includes(",")) {
    numericValue = normalizedValue
      .replace(/\./g, "")
      .replace(",", ".");
  }

  return Number(numericValue);
}