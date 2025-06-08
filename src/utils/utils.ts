import type { TabmateOptions } from "./types";

/**
 * Indents the given text by a specified number of tabs.
 * @param text - The text to indent
 * @param options - Optional configuration
 * @param options.tabs - Number of tabs to indent (default: 1)
 * @param options.tabWidth - Number of spaces per tab (default: 2)
 * @returns The indented text
 */
export function indent(text: string, options?: TabmateOptions): string {
  const tabs = options?.tabs ?? 1;
  const tabWidth = options?.tabWidth ?? 2;
  const spaces = " ".repeat(tabWidth * tabs);
  return `${spaces}${text}`;
}

/**
 * Removes indentation from the given text by a specified number of tabs.
 * @param text - The text to dedent
 * @param options - Optional configuration
 * @param options.tabs - Number of tabs to dedent (default: 1)
 * @param options.tabWidth - Number of spaces per tab (default: 2)
 * @returns The dedented text
 */
export function dedent(text: string, options?: TabmateOptions): string {
  const tabs = options?.tabs ?? 1;
  const tabWidth = options?.tabWidth ?? 2;
  const spacesToRemove = tabWidth * tabs;

  // Only remove leading spaces up to the specified amount
  const leadingSpaces = text.match(/^(\s*)/)?.[0].length ?? 0;
  const actualSpacesToRemove = Math.min(leadingSpaces, spacesToRemove);

  return text.slice(actualSpacesToRemove);
}
