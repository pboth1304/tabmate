import { describe, expect, it } from "vitest";
import { dedent, indent } from "./utils.ts";

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
});
