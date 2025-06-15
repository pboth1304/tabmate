import type {
  TabmateInstance,
  TabmateOptions,
  TabmateTarget,
} from "./types.ts";
import { dedentLines, indent, indentLines } from "./utils/utils.ts";

let globalDefaults: Required<TabmateOptions> = {
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
    const config: Required<TabmateOptions> = { ...globalDefaults, ...options };

    const handleKeydown = (event: KeyboardEvent) => {
      const { selectionStart, selectionEnd, value: textareaVal } = el;

      if (event.shiftKey && event.key === "Tab") {
        // Prevent the default browser behavior (moving focus to the next element)
        event.preventDefault();

        // Calculate how many spaces would be removed from the line containing the cursor
        const currentLineStart =
          textareaVal.lastIndexOf("\n", selectionStart - 1) + 1;
        const nextNewline = textareaVal.indexOf("\n", selectionStart);
        const currentLineEnd =
          nextNewline === -1 ? textareaVal.length : nextNewline;
        const currentLine = textareaVal.substring(
          currentLineStart,
          currentLineEnd,
        );
        const leadingSpaces = currentLine.match(/^(\s*)/)?.[0].length ?? 0;
        const spacesToRemove = Math.min(
          leadingSpaces,
          config.tabWidth * config.tabs,
        );

        // Dedent the text
        el.value = dedentLines(textareaVal, options);

        // Adjust cursor position based on removed spaces
        el.selectionStart = Math.max(
          currentLineStart,
          selectionStart - spacesToRemove,
        );
        el.selectionEnd = Math.max(
          currentLineStart,
          selectionEnd - spacesToRemove,
        );
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

        // Determine the start of the first selected line
        const startOfFirstLine =
          textareaVal.lastIndexOf("\n", selectionStart - 1) + 1;

        // Determine the end of the last selected line
        const nextNewline = textareaVal.indexOf("\n", selectionEnd);
        const endOfLastLine =
          nextNewline === -1 ? textareaVal.length : nextNewline;

        // Extract full lines to be indented
        const linesToIndent = textareaVal.slice(
          startOfFirstLine,
          endOfLastLine,
        );
        const indentedText = indentLines(linesToIndent, options);

        // Reconstruct the full textarea value with indented lines
        el.value =
          textareaVal.slice(0, startOfFirstLine) +
          indentedText +
          textareaVal.slice(endOfLastLine);

        // TODO: selection increases to the full line
        el.selectionStart = startOfFirstLine;
        el.selectionEnd = startOfFirstLine + indentedText.length;
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
}
