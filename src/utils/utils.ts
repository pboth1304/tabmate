import type { TabmateOptions } from "../types";

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

/**
 * Indents each line of a multiline text by a specified number of tabs.
 * @param text - The multiline text to indent
 * @param options - Optional configuration
 * @param options.tabs - Number of tabs to indent (default: 1)
 * @param options.tabWidth - Number of spaces per tab (default: 2)
 * @returns The indented multiline text
 */
export function indentLines(text: string, options?: TabmateOptions): string {
  const lines = text.split("\n");
  const indentedLines = lines.map((line) => indent(line, options));
  return indentedLines.join("\n");
}

/**
 * Removes indentation from each line of a multiline text by a specified number of tabs.
 * @param text - The multiline text to dedent
 * @param options - Optional configuration
 * @param options.tabs - Number of tabs to dedent (default: 1)
 * @param options.tabWidth - Number of spaces per tab (default: 2)
 * @returns The dedented multiline text
 */
export function dedentLines(text: string, options?: TabmateOptions): string {
  const lines = text.split("\n");
  const dedentedLines = lines.map((line) => dedent(line, options));
  return dedentedLines.join("\n");
}

/**
 * Calculates the range of lines that are fully or partially selected based on the given selection start and end indices.
 *
 * @param value - The string content in which the selection is made.
 * @param selectionStart - The starting index of the selection.
 * @param selectionEnd - The ending index of the selection.
 * @return An object containing `startOfFirstLine` (the starting index of the first line in the selection)
 * and `endOfLastLine` (the ending index of the last line in the selection).
 */
export function getSelectedLineRange(
  value: string,
  selectionStart: number,
  selectionEnd: number,
) {
  const startOfFirstLine = value.lastIndexOf("\n", selectionStart - 1) + 1;
  const nextNewline = value.indexOf("\n", selectionEnd);
  const endOfLastLine = nextNewline === -1 ? value.length : nextNewline;
  return { startOfFirstLine, endOfLastLine };
}

/**
 * Replaces a portion of the original string specified by the start and end indices with a replacement string.
 *
 * @param original - The original string to modify.
 * @param start - The zero-based starting index of the range to be replaced.
 * @param end - The zero-based ending index (exclusive) of the range to be replaced.
 * @param replacement - The string to insert in place of the specified range.
 * @return A new string with the specified range replaced by the given replacement string.
 */
export function replaceTextInRange(
  original: string,
  start: number,
  end: number,
  replacement: string,
) {
  return original.slice(0, start) + replacement + original.slice(end);
}
