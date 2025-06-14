import type {
  TabmateInstance,
  TabmateOptions,
  TabmateTarget,
} from "./types.ts";
import { indentLines } from "./utils/utils.ts";

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

    // Define the event handler function
    const handleKeydown = (event: KeyboardEvent) => {
      // Check if the Tab key was pressed
      if (event.key === "Tab") {
        // Prevent the default behavior (moving focus to the next element)
        event.preventDefault();

        // TODO: use selected lines only
        el.value = indentLines(el.value);
      }
    };

    // Add the event listener
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
