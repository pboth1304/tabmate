---
outline: deep
---

# API Reference

This page provides detailed information about the TabMate API, including the main function and its configuration options. 

It also describes the framework specific APIs.

## `@tabmate/core`


### `tabmate(el: HTMLElement, options:` [`TabmateOptions`](#tabmateoptions))

The main function that attaches tab behavior to an HTML element.

```js
import { tabmate } from "@tabmate/core";

const instance = tabmate(element, options);
```

#### Parameters

- `element` (HTMLElement): The HTML element to attach TabMate to, typically a textarea.
- `options` [`TabmateOptions`](#tabmateoptions): Configuration options for the tabmate instance.

#### Return Value

The `tabmate` function returns an instance of [`TabmateInstance`](#tabmateinstance):

### `TabmateInstance`

Represents an instance of Tabmate, providing methods to update options, manage its lifecycle, and retrieve its current state.

```ts
export interface TabmateInstance {
  /**
   * The HTML element associated with the Tabmate instance.
   */
  el: TabmateTarget;
  /**
   * Updates the configuration options for the Tabmate instance.
   */
  updateOptions(options: Partial<TabmateOptions>): void;
  /**
   * Detaches the Tabmate instance, cleaning up any event listeners.
   */
  detach(): void;
  /**
   * Retrieves the current configuration options of the Tabmate instance
   */
  getOptions(): TabmateOptions;
}
```

### `TabmateOptions`

Represents all configuration options which can be passed to the `tabmate` function.

```ts
export interface TabmateOptions {
  /**
   * Number of tabs to indent.
   */
  tabs?: number;
  /**
   * Number of spaces per tab.
   */
  tabWidth?: number;
}
```

## `@tabmate/vue`

### `useTabmate`

A Vue composable that initializes TabMate for a textarea element via a Vue ref.

Parameters:
- `target` (`Ref<HTMLTextAreaElement | null>`): A Vue ref pointing to the target `<textarea>` element.
- `options?` (`TabmateOptions`): Optional initial configuration.

Returns:
- `tabmate` (`Ref<TabmateInstance | null>`): The underlying TabMate instance or `null` until mounted.
- `isReady` (`Ref<boolean>`): `true` once the instance is created on mount and `false` after unmount.
- `updateOptions(newOptions: Partial<TabmateOptions>)`: Update the instance options at runtime.
- `getOptions(): TabmateOptions | undefined`: Get the current effective options from the instance.

### `vTabmate`

A Vue directive that attaches TabMate behavior directly to a `<textarea>` element.

Usage:

```ts
import { vTabmate } from "@tabmate/vue";
```

```html
<!-- Bind options; updates to the binding will update the instance options -->
<textarea v-tabmate="{ tabs: 1, tabWidth: 2 }"></textarea>
```

- Directive value: `Partial<TabmateOptions> | undefined`
- Target element: `<textarea>` (or an element compatible with the TabMate core API)

Behavior and lifecycle:
- `mounted`: Creates the TabMate instance with the provided options and stores it on the element.
- `updated`: Calls `updateOptions` on the existing instance when the bound options change.
- `unmounted`: Detaches the instance and cleans up.

Note: When using the directive, prefer passing only the options that differ from defaults. Options can be updated reactively by changing the bound value.