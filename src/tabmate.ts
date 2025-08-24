import type {
  TabmateInstance,
  TabmateOptions,
  TabmateTarget,
} from "./types.ts";
import {
  countSelectionOffset,
  dedentLines,
  getSelectedLineRange,
  indent,
  indentLines,
  replaceTextInRange,
} from "./utils/utils.ts";

const globalDefaults: Required<TabmateOptions> = {
  tabs: 1,
  tabWidth: 2,
};

export function tabmate(
  el: TabmateTarget,
  options?: TabmateOptions,
): TabmateInstance {
  return Tabmate.attach(el, options);
}

export class Tabmate {
  static attach(el: TabmateTarget, options?: TabmateOptions): TabmateInstance {
    let config: Required<TabmateOptions> = { ...globalDefaults, ...options };

    const handleKeydown = (event: KeyboardEvent) => {
      const { selectionStart, selectionEnd, value: textareaVal } = el;
      const tabSpaces = config.tabWidth * config.tabs;

      if (event.shiftKey && event.key === "Tab") {
        // Prevent the default browser behavior (moving focus to the next element)
        event.preventDefault();

        const { startOfFirstLine, endOfLastLine } = getSelectedLineRange(
          textareaVal,
          selectionStart,
          selectionEnd,
        );
        const linesToDedent = textareaVal.slice(
          startOfFirstLine,
          endOfLastLine,
        );
        const dedentedText = dedentLines(linesToDedent, config);

        // Dedent the text
        el.value = replaceTextInRange(
          textareaVal,
          startOfFirstLine,
          endOfLastLine,
          dedentedText,
        );
        // TODO: prevent cursor from going until to the start when no space left
        // Adjust cursor position based on removed spaces
        el.selectionStart = Math.max(
          startOfFirstLine,
          selectionStart - tabSpaces,
        );
        el.selectionEnd = Math.max(startOfFirstLine, selectionEnd - tabSpaces);
      } else if (event.key === "Tab") {
        // Prevent the default browser behavior (moving focus to the next element)
        event.preventDefault();

        if (selectionStart === selectionEnd) {
          const indented = indent(textareaVal.substring(selectionEnd), config);
          el.value = textareaVal.substring(0, selectionStart) + indented;

          const spaces = config.tabWidth * config.tabs;
          el.selectionStart = selectionStart + spaces;
          el.selectionEnd = selectionStart + spaces;

          return;
        }

        const { startOfFirstLine, endOfLastLine } = getSelectedLineRange(
          textareaVal,
          selectionStart,
          selectionEnd,
        );

        // Extract full lines to be indented
        const linesToIndent = textareaVal.slice(
          startOfFirstLine,
          endOfLastLine,
        );
        const indentedText = indentLines(linesToIndent, options);

        // Reconstruct the full textarea value with indented lines
        el.value = replaceTextInRange(
          textareaVal,
          startOfFirstLine,
          endOfLastLine,
          indentedText,
        );

        // Calculate a new selection range after indentation
        const selectedText = textareaVal.slice(selectionStart, selectionEnd);
        const {
          selectionStart: newSelectionStart,
          selectionEnd: newSelectionEnd,
        } = countSelectionOffset(
          startOfFirstLine,
          selectionStart,
          selectionEnd,
          selectedText,
          tabSpaces,
        );

        el.selectionStart = newSelectionStart;
        el.selectionEnd = newSelectionEnd;
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
      updateOptions(options: Partial<TabmateOptions>) {
        config = { ...config, ...options };
      },
    };
  }

  static detach(el: TabmateTarget, callback: (event: KeyboardEvent) => void) {
    el.removeEventListener("keydown", callback);
  }
}
