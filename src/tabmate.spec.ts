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

  await user.pointer({
    target: textareaEl,
    offset: 0, // Click at the beginning of the input
  });

  await user.keyboard("{tab}");
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
    await user.keyboard("{tab}");

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
});
