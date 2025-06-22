---
outline: deep
---

# API Reference

This page provides detailed information about the TabMate API, including the main function and its configuration options.

## `tabmate(el: HTMLElement, options:` [`TabmateOptions`](#tabmateoptions))

The main function that attaches tab behavior to an HTML element.

```js
import { tabmate } from "@tabmate/core";

const instance = tabmate(element, options);
```

### Parameters

- `element` (HTMLElement): The HTML element to attach TabMate to, typically a textarea.
- `options` [`TabmateOptions`](#tabmateoptions): Configuration options for the tabmate instance.

### Return Value

The `tabmate` function returns an instance of [`TabmateInstance`](#tabmateinstance):

## `TabmateInstance`

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

## `TabmateOptions`

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
