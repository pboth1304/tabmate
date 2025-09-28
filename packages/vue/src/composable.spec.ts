import { defineComponent, h, nextTick, onUnmounted, ref } from "vue";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, it } from "vitest";
import { useTabmate } from "./composable";

function setupComponent() {
  const exposed: any = {};

  const Comp = defineComponent({
    name: "UseTabmateTest",
    setup(_, { expose }) {
      const textareaRef = ref<HTMLTextAreaElement | null>(null);
      const composable = useTabmate(textareaRef);
      const value = ref("");

      // Make internals accessible to tests
      Object.assign(exposed, { textareaRef, ...composable, value });
      expose(exposed);

      onUnmounted(() => {
        // noop, ensure no errors on unmount
      });

      return () =>
        h("div", [
          h("textarea", {
            "aria-label": "editor",
            ref: textareaRef,
            value: value.value,
            onInput: (e: any) => (value.value = e.target.value),
          }),
        ]);
    },
  });

  const utils = render(Comp);
  return { utils, exposed } as const;
}

describe("useTabmate", () => {
  afterEach(() => {
    cleanup();
  });

  it("should attach on mount and detach on unmount (isReady toggles)", async () => {
    const { utils, exposed } = setupComponent();

    // Component renders and Tabmate attaches on mount
    const textarea = await screen.findByRole("textbox", { name: /editor/i });
    await nextTick();

    expect(exposed.isReady.value).toBe(true);
    expect(exposed.tabmate.value?.el).toBe(textarea);

    // Unmount should detach and reset state
    utils.unmount();
    await nextTick();
    expect(exposed.isReady.value).toBe(false);
    expect(exposed.tabmate.value).toBeNull();
  });

  it("should indent with default settings on Tab key", async () => {
    const { exposed } = setupComponent();
    const textarea = await screen.findByRole("textbox", { name: /editor/i });
    await nextTick();

    // Set initial content and caret position
    exposed.value.value = "line1";
    await nextTick();
    // Sync DOM value
    (textarea as HTMLTextAreaElement).value = exposed.value.value;
    textarea.focus();
    (textarea as HTMLTextAreaElement).setSelectionRange(0, 0);

    await fireEvent.keyDown(textarea, { key: "Tab" });

    // Default tabWidth=2, tabs=1 -> two leading spaces inserted at caret
    expect((textarea as HTMLTextAreaElement).value).toBe("  line1");
    // Caret should move by 2
    expect((textarea as HTMLTextAreaElement).selectionStart).toBe(2);
    expect((textarea as HTMLTextAreaElement).selectionEnd).toBe(2);
  });

  it("should indent selected lines with default settings and update selection", async () => {
    const { exposed } = setupComponent();
    const textarea = await screen.findByRole("textbox", { name: /editor/i });
    await nextTick();

    exposed.value.value = "a\nb\n";
    await nextTick();
    (textarea as HTMLTextAreaElement).value = exposed.value.value;
    textarea.focus();

    // Select from start of first line to end of second line
    (textarea as HTMLTextAreaElement).setSelectionRange(0, 3); // "a\nb"

    await fireEvent.keyDown(textarea, { key: "Tab" });

    // Each non-empty line indented by 2 spaces
    expect((textarea as HTMLTextAreaElement).value).toBe("  a\n  b\n");

    // Selection should shift by +2 at start and +2 per line
    // Original start 0 -> 2, original end 3 -> 3 + 2 (block) + 2 (second line) = 7
    expect((textarea as HTMLTextAreaElement).selectionStart).toBe(2);
    expect((textarea as HTMLTextAreaElement).selectionEnd).toBe(7);
  });

  it("should dedent selected lines with Shift+Tab", async () => {
    const { exposed } = setupComponent();
    const textarea = await screen.findByRole("textbox", { name: /editor/i });
    await nextTick();

    // Start with indented lines
    exposed.value.value = "  a\n  b\n";
    await nextTick();
    (textarea as HTMLTextAreaElement).value = exposed.value.value;
    textarea.focus();

    // Select from start to end of both lines
    (textarea as HTMLTextAreaElement).setSelectionRange(
      0,
      exposed.value.value.length - 1,
    );

    await fireEvent.keyDown(textarea, { key: "Tab", shiftKey: true });

    expect((textarea as HTMLTextAreaElement).value).toBe("a\nb\n");
    // Selection typically moves left by two; selection bounds should not exceed start
    expect((textarea as HTMLTextAreaElement).selectionStart).toBe(0);
  });

  it("should support updating options via composable", async () => {
    const { exposed } = setupComponent();
    const textarea = await screen.findByRole("textbox", { name: /editor/i });
    await nextTick();

    // Update tabWidth to 4
    exposed.updateOptions({ tabWidth: 4 });
    expect(exposed.getOptions()).toMatchObject({ tabWidth: 4, tabs: 1 });

    exposed.value.value = "x";
    await nextTick();
    (textarea as HTMLTextAreaElement).value = exposed.value.value;
    textarea.focus();
    (textarea as HTMLTextAreaElement).setSelectionRange(0, 0);

    await fireEvent.keyDown(textarea, { key: "Tab" });

    expect((textarea as HTMLTextAreaElement).value).toBe("    x"); // 4 spaces
    expect((textarea as HTMLTextAreaElement).selectionStart).toBe(4);
    expect((textarea as HTMLTextAreaElement).selectionEnd).toBe(4);
  });
});
