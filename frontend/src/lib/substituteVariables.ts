import { FieldValues } from "@/types/template";

const VARIABLE_CLASSES = ["coverpage_link", "keyterms_link", "orderform_link", "businessterms_link", "sow_link"];

function normalizeKey(text: string): string {
  // Strip possessives for lookup
  return text.replace(/['']s?$/, "");
}

function restorePossessive(original: string, value: string): string {
  if (original.endsWith("'s")) {
    return `${value}'s`;
  }
  if (original.endsWith("'")) {
    return `${value}'`;
  }
  return value;
}

export function substituteVariables(
  markdown: string,
  values: FieldValues,
  options?: { highlightEmpty?: boolean }
): string {
  let result = markdown;

  // Handle bracket placeholders first (cover page style)
  const bracketPattern = /\[([^\[\]]+)\]/g;
  result = result.replace(bracketPattern, (match, text) => {
    const trimmed = text.trim();
    // Skip checkboxes [x] and [ ]
    if (/^\s*[xX]?\s*$/.test(trimmed)) {
      return match;
    }
    const normalized = normalizeKey(trimmed);
    const value = values[normalized];
    return value ? value : match;
  });

  // Handle span-based variables
  for (const varClass of VARIABLE_CLASSES) {
    const spanPattern = new RegExp(
      `<span class="${varClass}">([^<]+)<\\/span>`,
      "g"
    );
    result = result.replace(spanPattern, (match, text) => {
      const normalized = normalizeKey(text);
      const value = values[normalized];

      if (value) {
        const restored = restorePossessive(text, value);
        return `<span class="${varClass}">${restored}</span>`;
      }

      if (options?.highlightEmpty) {
        return `<span class="${varClass}" data-empty="true">${text}</span>`;
      }

      return match;
    });
  }

  return result;
}

export function getCompletionPercentage(
  variables: string[],
  values: FieldValues,
  requiredOnly = true
): number {
  const normalized = variables.map((v) => normalizeKey(v));
  const filled = normalized.filter((v) => values[v]).length;
  return normalized.length > 0 ? Math.round((filled / normalized.length) * 100) : 100;
}
