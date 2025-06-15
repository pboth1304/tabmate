import { describe, expect, it } from "vitest";
import {
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
});
