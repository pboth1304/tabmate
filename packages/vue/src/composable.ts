import { ref, onMounted, onUnmounted, type Ref } from "vue";
import {
  tabmate as createTabmate,
  type TabmateInstance,
  type TabmateOptions,
} from "@tabmate/core";

export function useTabmate(
  target: Ref<HTMLTextAreaElement | null>,
  options?: TabmateOptions,
) {
  const instance = ref<TabmateInstance | null>(null);
  const isReady = ref(false);

  onMounted(() => {
    if (target.value) {
      instance.value = createTabmate(target.value, options);
      isReady.value = true;
    }
  });

  onUnmounted(() => {
    if (instance.value) {
      instance.value.detach();
      instance.value = null;
      isReady.value = false;
    }
  });

  const updateOptions = (newOptions: Partial<TabmateOptions>) => {
    if (instance.value) {
      instance.value.updateOptions(newOptions);
    }
  };

  const getOptions = () => {
    return instance.value?.getOptions();
  };

  return {
    tabmate: instance,
    isReady,
    updateOptions,
    getOptions,
  };
}
