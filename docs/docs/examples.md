<script setup>
import PreviewBasic from '../components/PreviewBasic.vue';
import PreviewTabWidth from '../components/PreviewTabWidth.vue';
</script>

# Examples

This page provides examples of how to use TabMate in different scenarios.

## Basic Usage

The simplest way to use TabMate is to attach it to a textarea element:

```js
import { tabmate } from "@tabmate/core";

// Get a reference to your textarea
const textarea = document.querySelector("textarea");

// Attach TabMate to the textarea
const instance = tabmate(textarea);

// Now the textarea has enhanced tab behavior!
```

With this basic setup, your textarea will now support:

- Pressing `Tab` to insert spaces
- Pressing `Shift+Tab` to remove indentation
- Multi-line indentation when text is selected

### Preview

<PreviewBasic />

## Customizing Tab Width

You can customize the width of tabs by providing options:

```js
import { tabmate } from "@tabmate/core";

const textarea = document.querySelector("textarea");

// Configure TabMate with 4 spaces per tab
const instance = tabmate(textarea, {
  tabWidth: 12,
});
```

### Preview

<PreviewTabWidth />

## Customizing Number of Tabs

You can also customize how many tabs are inserted at once:

```js
import { tabmate } from "@tabmate/core";

const textarea = document.querySelector("textarea");

// Configure TabMate to insert 2 tabs (with default width of 2 spaces each)
const instance = tabmate(textarea, {
  tabs: 2,
});

// This would insert 4 spaces (2 tabs × 2 spaces) when Tab is pressed
```

## Managing TabMate Instances

TabMate returns an instance that allows you to control its behavior:

```js
import { tabmate } from "@tabmate/core";

const textarea = document.querySelector("textarea");
const instance = tabmate(textarea);

// Get current options
const options = instance.getOptions();
console.log(options); // { tabs: 1, tabWidth: 2 }

// Update options after initialization
instance.updateOptions({ tabWidth: 4 });

// Detach TabMate when you no longer need it
instance.detach();
// The textarea will now behave normally (Tab will move focus to the next element)
```
