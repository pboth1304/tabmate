# Vue Integration

This guide shows how to use TabMate in Vue 3 via the `@tabmate/vue` package. You can use it either as a composable or as a directive.

## Installation

Install the Vue integration package:

:::: code-group

```shell [npm]
npm i @tabmate/core @tabmate/vue
```

```shell [yarn]
yarn add @tabmate/core @tabmate/vue
```

```shell [pnpm]
pnpm add @tabmate/core @tabmate/vue
```

::::

## Usage

You can integrate TabMate into Vue in two ways:

- As a composable
- As a directive

### `useTabmate` composable

Basic example using the Composition API:

```vue

<script setup lang="ts">
  import {ref, onMounted} from 'vue';
  import {useTabmate} from '@tabmate/vue';
  import {TabmateOptions} from "@tabmate/core";

  const tabmateConfig: TabmateOptions = {}; // Add your optional tabmate config options here (e.g. custom tabWidth)

  const textareaRef = ref<HTMLTextAreaElement | null>(null);

  const {isReady, tabmate, updateOptions, getOptions} = useTabmate(textareaRef, tabmateConfig);

  const value = ref('');

  onMounted(() => {
    // You can inspect or update options after mount
    // console.log(getOptions());
  });
</script>

<template>
  <textarea
      ref="textareaRef"
      v-model="value"
      rows="6"
  />
  <p v-if="!isReady">Attaching TabMate…</p>
</template>
```

Customize the composable at runtime:

```ts
// Update options later (e.g., change tab width to 4 spaces)
updateOptions({ tabWidth: 4 });

// Read back the effective options
const current = getOptions(); // { tabs: 1, tabWidth: 4 }
```

### As Directive

You can also apply TabMate using a directive on your textarea.

Register locally in a component (Options API example):

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { vTabmate } from '@tabmate/vue';

export default defineComponent({
  directives: {
    tabmate: vTabmate,
  },
  data() {
    return {
      value: '',
      options: { tabWidth: 2, tabs: 1 },
    };
  },
});
</script>

<template>
  <textarea
    v-model="value"
    v-tabmate="options"
    aria-label="editor"
    rows="6"
  />
</template>
```

Or import from the package entry and re-export if you set up a global directive:

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import vTabmate from '@tabmate/vue/dist/directive';

const app = createApp(App);
app.directive('tabmate', vTabmate);
app.mount('#app');
```

Customize via directive binding:

```vue
<script setup lang="ts">
import { reactive } from 'vue';
const options = reactive({ tabWidth: 4, tabs: 1 });
</script>

<template>
  <textarea v-tabmate="options" />
  <button @click="options.tabWidth = 2">Use 2‑space tabs</button>
  <button @click="options.tabWidth = 4">Use 4‑space tabs</button>
  <button @click="options.tabs = 2">Insert two tabs at once</button>
</template>
```

Notes:
- v-tabmate updates the instance when the binding value changes (options object).
- Detachment happens automatically on component unmount.
