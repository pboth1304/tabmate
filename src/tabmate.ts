import type {
  TabmateInstance,
  TabmateOptions,
  TabmateTarget,
} from "./types.ts";
import { indentLines, dedentLines } from "./utils/utils.ts";

let globalDefaults: Required<TabmateOptions> = {
  tabs: 1,
  tabWidth: 12,
};

export function tabmate(
  el: TabmateTarget,
  options?: TabmateOptions,
): TabmateInstance {
  return Tabmate.attach(el, options);
}

export class Tabmate {
  static attach(el: TabmateTarget, options?: TabmateOptions): TabmateInstance {
    const config: Required<TabmateOptions> = { ...globalDefaults, ...options };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "Tab") {
        // Prevent the default browser behavior (moving focus to the next element)
        event.preventDefault();

        // TODO: use selected lines only
        el.value = dedentLines(el.value, options);
      } else if (event.key === "Tab") {
        // Prevent the default browser behavior (moving focus to the next element)
        event.preventDefault();

        el.value = indentLines(el.value, options);
      }
    };

    el.addEventListener("keydown", handleKeydown);

    // TODO: add logic for contenteditable

    return {
      el,
      detach() {
        Tabmate.detach(el, handleKeydown);
      },
      getOptions() {
        return { ...config };
      },
    };
  }

  static detach(el: TabmateTarget, callback: (event: KeyboardEvent) => void) {
    el.removeEventListener("keydown", callback);
  }

  static handleIndent(el: TabmateTarget, options: Required<TabmateOptions>) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;

    // If there's no selection, just insert a tab at cursor position
    if (start === end) {
      const spaces = " ".repeat(options.tabWidth * options.tabs);
      el.value = value.substring(0, start) + spaces + value.substring(end);
      el.selectionStart = el.selectionEnd = start + spaces.length;
      return;
    }

    // Find the beginning of the first line in selection
    const firstLineStart = value.lastIndexOf("\n", start - 1) + 1;
    // Find the end of the last line in selection (or end of text)
    const lastLineEnd =
      value.indexOf("\n", end) === -1 ? value.length : value.indexOf("\n", end);

    // Get the text to be modified (full lines)
    const selectedLines = value.substring(firstLineStart, lastLineEnd);
    const newText = indentLines(selectedLines, options);

    // Replace the text
    el.value =
      value.substring(0, firstLineStart) +
      newText +
      value.substring(lastLineEnd);

    // Restore selection
    el.selectionStart = firstLineStart;
    el.selectionEnd = firstLineStart + newText.length;
  }
}
