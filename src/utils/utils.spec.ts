import { describe, expect, it } from "vitest";
import {
  countSelectionOffset,
  dedent,
  dedentLines,
  getSelectedLineRange,
  indent,
  indentLines,
  replaceTextInRange,
} from "./utils.ts";

describe("utils", () => {
  describe("indent", () => {
    it("should indent text in default config by one tab", () => {
      const given = "test";

      const result = indent(given);

      expect(result).toEqual(`  ${given}`);
    });

    it("should indent text by the given amount of tabs", () => {
      const given = "test";

      const result = indent(given, { tabs: 2 });

      expect(result).toEqual(`    ${given}`);
    });

    it("should use the configured tab width for indenting", () => {
      const given = "test";

      const result = indent(given, { tabWidth: 8 });

      expect(result).toEqual(`        ${given}`);
    });
  });

  describe("dedent", () => {
    it("should dedent text", () => {
      const given = "test";
      const indented = indent(given);

      const result = dedent(indented);

      expect(result).toEqual(`${given}`);
    });

    it("should dedent text by the given amount of tabs", () => {
      const given = "test";
      const indented = `    ${given}`;

      const result = dedent(indented, { tabs: 2 });

      expect(result).toEqual(`${given}`);
    });

    it("should dedent text by the given tab width", () => {
      const given = "test";
      const indented = `    ${given}`;

      const result = dedent(indented, { tabWidth: 2 });

      expect(result).toEqual(`  ${given}`);
    });

    it("should remove leading spaces up to the specified tab width, even when the text has fewer leading spaces than requested", () => {
      const given = "test";
      const indented = `    ${given}`;

      const result = dedent(indented, { tabWidth: 20 });

      expect(result).toEqual(`${given}`);
    });
  });

  describe("multiline", () => {
    it("should indent multiple lines of text", () => {
      const given = "user:\n  name: John Doe\n  email: john.doe@example.com";

      const result = indentLines(given);

      expect(result).toEqual(
        "  user:\n    name: John Doe\n    email: john.doe@example.com",
      );
    });

    it("should skip blank lines when indenting", () => {
      const given = "user:\n  name: John Doe\n\n  email: john.doe@example.com";

      const result = indentLines(given);

      expect(result).toEqual(
        "  user:\n    name: John Doe\n\n    email: john.doe@example.com",
      );
    });

    it("should dedent multiple lines of text", () => {
      const given =
        "  user:\n    name: John Doe\n    email: john.doe@example.com";

      const result = dedentLines(given);

      expect(result).toEqual(
        "user:\n  name: John Doe\n  email: john.doe@example.com",
      );
    });
  });

  describe("getSelectedLineRange", () => {
    it("should return correct line range for selection within a line", () => {
      const text = "This is a test line";
      const selectionStart = 5;
      const selectionEnd = 9;

      const result = getSelectedLineRange(text, selectionStart, selectionEnd);

      expect(result.startOfFirstLine).toBe(0);
      expect(result.endOfLastLine).toBe(text.length);
    });

    it("should return correct line range for selection spanning multiple lines", () => {
      const text = "First line\nSecond line\nThird line";
      const selectionStart = 5;
      const selectionEnd = 20;

      const result = getSelectedLineRange(text, selectionStart, selectionEnd);

      expect(result.startOfFirstLine).toBe(0);
      expect(result.endOfLastLine).toBe(22);
    });

    it("should handle selection at the start of text", () => {
      const text = "First line\nSecond line";
      const selectionStart = 0;
      const selectionEnd = 3;

      const result = getSelectedLineRange(text, selectionStart, selectionEnd);

      expect(result.startOfFirstLine).toBe(0);
      expect(result.endOfLastLine).toBe(10);
    });

    it("should handle selection at the end of text", () => {
      const text = "First line\nSecond line\nThird line";
      const selectionStart = 15;
      const selectionEnd = 25;

      const result = getSelectedLineRange(text, selectionStart, selectionEnd);

      expect(result.startOfFirstLine).toBe(11);
      expect(result.endOfLastLine).toBe(33);
    });

    it("should handle empty text", () => {
      const text = "";
      const selectionStart = 0;
      const selectionEnd = 0;

      const result = getSelectedLineRange(text, selectionStart, selectionEnd);

      expect(result.startOfFirstLine).toBe(0);
      expect(result.endOfLastLine).toBe(0);
    });
  });

  describe("replaceTextInRange", () => {
    it("should replace text in the middle of a string", () => {
      const original = "This is a test string";
      const start = 5;
      const end = 7;
      const replacement = "was";

      const result = replaceTextInRange(original, start, end, replacement);

      expect(result).toBe("This was a test string");
    });

    it("should replace text at the start of a string", () => {
      const original = "This is a test string";
      const start = 0;
      const end = 4;
      const replacement = "That";

      const result = replaceTextInRange(original, start, end, replacement);

      expect(result).toBe("That is a test string");
    });

    it("should replace text at the end of a string", () => {
      const original = "This is a test string";
      const start = 15;
      const end = 21;
      const replacement = "example";

      const result = replaceTextInRange(original, start, end, replacement);

      expect(result).toBe("This is a test example");
    });

    it("should handle empty replacement", () => {
      const original = "This is a test string";
      const start = 5;
      const end = 7;
      const replacement = "";

      const result = replaceTextInRange(original, start, end, replacement);

      expect(result).toBe("This  a test string");
    });

    it("should handle empty original string", () => {
      const original = "";
      const start = 0;
      const end = 0;
      const replacement = "New text";

      const result = replaceTextInRange(original, start, end, replacement);

      expect(result).toBe("New text");
    });
  });

  describe("countSelectionOffset", () => {
    it("should calculate new selection for single line text", () => {
      const startOfFirstLine = 0;
      const selectionStart = 2;
      const selectionEnd = 6;
      const selectedText = "This is a test";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(4); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (2)
      expect(result.selectionEnd).toBe(8); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (6)
    });

    it("should calculate new selection for multi-line text", () => {
      const startOfFirstLine = 0;
      const selectionStart = 2;
      const selectionEnd = 15;
      const selectedText = "First line\nSecond line";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(4); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (2)
      expect(result.selectionEnd).toBe(19); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (15) + lineCountOffset (1 * 2)
    });

    it("should handle selection at the beginning of text", () => {
      const startOfFirstLine = 0;
      const selectionStart = 0;
      const selectionEnd = 5;
      const selectedText = "First line";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(2); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (0)
      expect(result.selectionEnd).toBe(7); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (5)
    });

    it("should handle selection at the end of text", () => {
      const startOfFirstLine = 0;
      const selectionStart = 6;
      const selectionEnd = 10;
      const selectedText = "First line";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(8); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (6)
      expect(result.selectionEnd).toBe(12); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (10)
    });

    it("should handle selection with multiple lines", () => {
      const startOfFirstLine = 0;
      const selectionStart = 2;
      const selectionEnd = 33;
      const selectedText = "First line\nSecond line\nThird line";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(4); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (2)
      expect(result.selectionEnd).toBe(39); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (33) + lineCountOffset (2 * 2)
    });

    it("should handle non-zero startOfFirstLine", () => {
      const startOfFirstLine = 5;
      const selectionStart = 7;
      const selectionEnd = 12;
      const selectedText = "Test";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(9); // startOfFirstLine (5) + tabSpaces (2) + relativeStart (7 - 5)
      expect(result.selectionEnd).toBe(14); // startOfFirstLine (5) + tabSpaces (2) + relativeEnd (12 - 5)
    });

    it("should correctly handle trailing newline in selectedText", () => {
      const startOfFirstLine = 0;
      const selectionStart = 0;
      const selectionEnd = 9;
      const selectedText = "Line one\n"; // 1 line, ends with newline
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(2); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (0)
      expect(result.selectionEnd).toBe(13); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (9) + lineCountOffset (0 * 2)
    });

    it("should handle empty selection", () => {
      const startOfFirstLine = 0;
      const selectionStart = 5;
      const selectionEnd = 5;
      const selectedText = "";
      const tabSpaces = 2;

      const result = countSelectionOffset(
        startOfFirstLine,
        selectionStart,
        selectionEnd,
        selectedText,
        tabSpaces,
      );

      expect(result.selectionStart).toBe(7); // startOfFirstLine (0) + tabSpaces (2) + relativeStart (5)
      expect(result.selectionEnd).toBe(7); // startOfFirstLine (0) + tabSpaces (2) + relativeEnd (5)
    });
  });
});
