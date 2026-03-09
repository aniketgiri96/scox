function stripFences(input: string): string {
  return input
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function extractFirstJsonObject(input: string): string | null {
  const firstCurly = input.indexOf("{");
  const lastCurly = input.lastIndexOf("}");
  if (firstCurly >= 0 && lastCurly > firstCurly) {
    return input.slice(firstCurly, lastCurly + 1);
  }

  const firstArray = input.indexOf("[");
  const lastArray = input.lastIndexOf("]");
  if (firstArray >= 0 && lastArray > firstArray) {
    return input.slice(firstArray, lastArray + 1);
  }

  return null;
}

export function parseJsonResponse<T>(raw: string): T {
  const cleaned = stripFences(raw);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const extracted = extractFirstJsonObject(cleaned);
    if (extracted) {
      return JSON.parse(extracted) as T;
    }
    throw new Error("Model response is not valid JSON");
  }
}
