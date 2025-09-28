import { defineComponent, nextTick, onUnmounted, ref } from "vue";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, it } from "vitest";
import vTabmate from "./directive";

function setupComponent() {
  const exposed: any = {};

  const Comp = defineComponent({
    name: "DirectiveTabmateTest",
    directives: { tabmate: vTabmate },
    data() {
      return {
        value: "",
        options: {},
      } as any;
    },
    mounted() {
      const componentInstance = this;
      Object.assign(exposed, {
        get textareaRef() {
          return (
            (componentInstance.$refs
              .textareaRef as HTMLTextAreaElement | null) ?? null
          );
        },
        valueRef: this.$data,
        setOptions: (o: any) => Object.assign(this.$data.options, o),
        replaceOptions: (o: any) => (this.$data.options = { ...o }),
      });
    },
    unmounted() {
      // ensure no errors on unmount
    },
    template:
      '<div>\n        <textarea aria-label="editor" ref="textareaRef" v-model="value" v-tabmate="options"></textarea>\n      </div>',
  });

  const utils = render(Comp);
  return { utils, exposed } as const;
}

describe("v-tabmate directive", () => {
  afterEach(() => {
    cleanup();
  });

  it("should attach on mount and detach on unmount", async () => {
    const { utils, exposed } = setupComponent();

    const textarea = (await screen.findByRole("textbox", {
      name: /editor/i,
    })) as HTMLTextAreaElement;
    await nextTick();

    // Should have internal instance attached on element
    expect((textarea as any).__tabmate__).toBeTruthy();

    // Unmount should detach and remove marker
    utils.unmount();
    await nextTick();
    expect((textarea as any).__tabmate__).toBeUndefined();
  });

  it("should indent with default settings on Tab key", async () => {
    const { exposed } = setupComponent();
    const textarea = (await screen.findByRole("textbox", {
      name: /editor/i,
    })) as HTMLTextAreaElement;
    await nextTick();

    // Set initial content and caret position
    exposed.valueRef.value = "line1";
    await nextTick();
    textarea.value = exposed.valueRef.value;
    textarea.focus();
    textarea.setSelectionRange(0, 0);

    await fireEvent.keyDown(textarea, { key: "Tab" });

    expect(textarea.value).toBe("  line1");
    expect(textarea.selectionStart).toBe(2);
    expect(textarea.selectionEnd).toBe(2);
  });

  it("should indent selected lines with default settings and update selection", async () => {
    const { exposed } = setupComponent();
    const textarea = (await screen.findByRole("textbox", {
      name: /editor/i,
    })) as HTMLTextAreaElement;
    await nextTick();

    exposed.valueRef.value = "a\nb\n";
    await nextTick();
    textarea.value = exposed.valueRef.value;
    textarea.focus();

    textarea.setSelectionRange(0, 3); // select "a\nb"

    await fireEvent.keyDown(textarea, { key: "Tab" });

    expect(textarea.value).toBe("  a\n  b\n");
    expect(textarea.selectionStart).toBe(2);
    expect(textarea.selectionEnd).toBe(7);
  });

  it("should dedent selected lines with Shift+Tab", async () => {
    const { exposed } = setupComponent();
    const textarea = (await screen.findByRole("textbox", {
      name: /editor/i,
    })) as HTMLTextAreaElement;
    await nextTick();

    exposed.valueRef.value = "  a\n  b\n";
    await nextTick();
    textarea.value = exposed.valueRef.value;
    textarea.focus();

    textarea.setSelectionRange(0, exposed.valueRef.value.length - 1);

    await fireEvent.keyDown(textarea, { key: "Tab", shiftKey: true });

    expect(textarea.value).toBe("a\nb\n");
    expect(textarea.selectionStart).toBe(0);
  });

  it("should support updating options via directive binding", async () => {
    const { exposed } = setupComponent();
    const textarea = (await screen.findByRole("textbox", {
      name: /editor/i,
    })) as HTMLTextAreaElement;
    await nextTick();

    // Update tabWidth to 4 via binding value
    exposed.replaceOptions({ tabWidth: 4 });
    await nextTick();

    exposed.valueRef.value = "x";
    await nextTick();
    textarea.value = exposed.valueRef.value;
    textarea.focus();
    textarea.setSelectionRange(0, 0);

    await fireEvent.keyDown(textarea, { key: "Tab" });

    expect(textarea.value).toBe("    x");
    expect(textarea.selectionStart).toBe(4);
    expect(textarea.selectionEnd).toBe(4);
  });
});
