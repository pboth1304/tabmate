# Getting started

## Installation

Install the package with the following commands:

::: code-group

```shell [npm]
npm i @tabmate/core
```

```shell [yarn]
yarn add @tabmate/core
```

```shell [pnpm]
pnpm add @tabmate/core
```

:::

## Usage

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

If you want to find out about all the configuration options of the `tabmate` instance you can check it out in the [doc](../api.md).
