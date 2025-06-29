# Tabmate Changelog

## v0.2.0 - "SkipTok" (2025-06-29)

### Features

- Ignore blank lines when indenting multiple lines

## v0.1.0 - "Tab Zero" (2025-06-22)

### Features
- Core `tabmate` function to override default tab handling in HTML elements
- Tab key support for indenting text (single line or selection)
- Shift+Tab support for dedenting text
- Provide configuration options for tab width and number of tabs

API for managing tabmate instances:
  - `attach()`: Create a new tabmate instance to a HTML element
  - `detach()`: Remove tabmate instance from given HTML element
  - `getOptions()`: Get current configuration
  - `updateOptions()`: Update configuration options