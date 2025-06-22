import { describe, expect, it } from "vitest";
import { getByTestId } from "@testing-library/dom";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { tabmate } from "./tabmate.ts";
import type { TabmateOptions } from "./types.ts";

const renderTextarea = () => {
  const user = userEvent.setup();

  const container = document.createElement("div");
  container.innerHTML = `
    <textarea data-testid="textarea"></textarea>
  `;

  document.body.appendChild(container);

  return { container, user };
};

const typeAndIndent = async (
  textareaEl: HTMLTextAreaElement,
  textContent: string,
  user: UserEvent,
) => {
  await user.type(textareaEl, textContent);
  textareaEl.setSelectionRange(0, 0);
  await user.tab();
};

describe("tabmate", () => {
  it("should prevent default behaviour and indent text in textarea", async () => {
    const given = "test";
    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    tabmate(textareaEl);

    await typeAndIndent(textareaEl, given, user);

    expect(textareaEl.value).toEqual(`  ${given}`);
  });

  it("should keep selection when indenting", async () => {
    const given = "test";

    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    tabmate(textareaEl);
    await typeAndIndent(textareaEl, given, user);
    expect(textareaEl.value).toEqual(`  ${given}`);
    textareaEl.setSelectionRange(4, 6); // selects 'st' in 'test'

    await user.tab();

    // Cursor should still select 'st'
    expect(textareaEl.selectionStart).toBe(6);
    expect(textareaEl.selectionEnd).toBe(8);
  });

  it("should keep selection when indenting multiple lines", async () => {
    const given = "user:\n  name: John Doe\n  email: john.doe@example.com";

    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    tabmate(textareaEl);
    await user.type(textareaEl, given);
    textareaEl.setSelectionRange(14, 36); // selects 'John Doeemail: john' in the given textr

    // Tab again, to cause bug that selectionEnd stays at current position when multi line select
    await user.tab();

    // Cursor should still select 'John Doeemail: john'
    expect(textareaEl.selectionStart).toBe(16);
    expect(textareaEl.selectionEnd).toBe(40);
    expect(textareaEl.value).toEqual(
      "user:\n    name: John Doe\n    email: john.doe@example.com",
    );
  });

  it("should be able to detend text in textarea", async () => {
    const given = "test";

    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    // Type and indent text first, so it can be dedented
    tabmate(textareaEl);
    await typeAndIndent(textareaEl, given, user);
    expect(textareaEl.value).toEqual(`  ${given}`);

    // Press shift+tab for dedenting
    await user.tab({ shift: true });

    expect(textareaEl.value).toEqual(given);
  });

  it("should keep mouse pointer position where it was after dedenting", async () => {
    const given = "test";

    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    // Type and indent text first, so it can be dedented
    tabmate(textareaEl);
    await typeAndIndent(textareaEl, given, user);
    expect(textareaEl.value).toEqual(`  ${given}`);
    textareaEl.setSelectionRange(4, 4); // moves cursor between 'e' and 's' in 'test'

    // Press shift+tab for detending
    await user.tab({ shift: true });

    // Cursor should still be between 'e' and 's' of 'test'
    expect(textareaEl.selectionStart).toBe(2);
    expect(textareaEl.selectionEnd).toBe(2);
  });

  it("should keep selection where it was after dedenting", async () => {
    const given = "test";

    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    // Type and indent text first, so it can be dedented
    tabmate(textareaEl);
    await typeAndIndent(textareaEl, given, user);
    expect(textareaEl.value).toEqual(`  ${given}`);
    textareaEl.setSelectionRange(4, 6); // selects 'st' in 'test'

    // Press shift+tab for detending
    await user.tab({ shift: true });

    // Cursor should still select 'st'
    expect(textareaEl.selectionStart).toBe(2);
    expect(textareaEl.selectionEnd).toBe(4);
  });

  it("should remove selection if there are no leading spaces left after dedenting", async () => {
    const given = "test";

    const { container, user } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    // Type and indent text first, so it can be dedented
    tabmate(textareaEl);
    await typeAndIndent(textareaEl, given, user);
    expect(textareaEl.value).toEqual(`  ${given}`);
    textareaEl.setSelectionRange(0, 2); // selects the space in front of the indented text

    // Press shift+tab for detending
    await user.tab({ shift: true });

    // Cursor should still select 'st'
    expect(textareaEl.selectionStart).toBe(0);
    expect(textareaEl.selectionEnd).toBe(0);
  });

  it("should indent starting from mouse pointer position", async () => {
    const given = "test";

    const { user, container } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");
    tabmate(textareaEl);

    await user.type(textareaEl, given);
    textareaEl.setSelectionRange(2, 2); // moves cursor between 'e' and 's' in 'test'

    await user.tab();

    expect(textareaEl.value).toEqual("te  st");
  });

  it("should indent multiple lines for current selection", async () => {
    const given = `test
    indentation
      with multiple lines`;

    const { user, container } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");
    tabmate(textareaEl);

    await user.type(textareaEl, given);

    textareaEl.focus();
    // Select from start of second line to end of third line
    textareaEl.setSelectionRange(5, given.length);

    await user.tab();

    expect(textareaEl.value).toEqual(`test
      indentation
        with multiple lines`);
  });

  it("should restore default tab behavior after detach", async () => {
    const given = "test";
    const { container, user } = renderTextarea();

    // Create a second textarea to test that tabbing happens between textarea after detaching
    const secondTextarea = document.createElement("textarea");
    secondTextarea.setAttribute("data-testid", "second-textarea");
    container.appendChild(secondTextarea);

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");

    const instance = tabmate(textareaEl);

    // Verify tabbing is working
    await typeAndIndent(textareaEl, given, user);

    expect(textareaEl.value).toEqual("  test");

    // Detach tab event listener
    instance.detach();

    // Press tab - should now move focus to the second textarea instead of indenting
    await user.tab();

    // Check that the value is still the same as before
    expect(textareaEl.value).toEqual("  test");
    // Check that focus moved to the second textarea (default tab behavior)
    expect(document.activeElement).toBe(secondTextarea);
  });

  it("should return given config", async () => {
    const customConfig: TabmateOptions = { tabWidth: 100 };
    const expectedConfig: TabmateOptions = {
      ...customConfig,
      tabs: 1, // default value
    };

    const { container } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");
    const instance = tabmate(textareaEl, customConfig);

    const config = instance.getOptions();

    expect(config).toEqual(expectedConfig);
  });

  it("should update config", async () => {
    const customConfig: TabmateOptions = { tabWidth: 100 };
    const expectedConfig: TabmateOptions = {
      ...customConfig,
      tabs: 1, // default value
    };

    const { container } = renderTextarea();

    const textareaEl: HTMLTextAreaElement = getByTestId(container, "textarea");
    const instance = tabmate(textareaEl);

    instance.updateOptions(customConfig);

    const newConfig = instance.getOptions();

    expect(newConfig).toEqual(expectedConfig);
  });
});
