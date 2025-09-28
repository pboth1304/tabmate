import { type Directive } from "vue";
import {
  tabmate as createTabmate,
  type TabmateInstance,
  type TabmateOptions,
} from "@tabmate/core";

interface TabmateElement extends HTMLTextAreaElement {
  __tabmate__?: TabmateInstance;
}

const vTabmate: Directive<TabmateElement, Partial<TabmateOptions> | undefined> =
  {
    mounted(el, binding) {
      const options = binding.value || {};
      el.__tabmate__ = createTabmate(el, options);
    },

    updated(el, binding) {
      const instance = el.__tabmate__;
      if (instance && binding.value) {
        instance.updateOptions(binding.value);
      }
    },

    unmounted(el) {
      const instance = el.__tabmate__;
      if (instance) {
        instance.detach();
        delete el.__tabmate__;
      }
    },
  };

export default vTabmate;
