function stripFences(input: string): string {
  return input
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export function parseJsonResponse<T>(raw: string): T {
  const cleaned = stripFences(raw);
  return JSON.parse(cleaned) as T;
}
