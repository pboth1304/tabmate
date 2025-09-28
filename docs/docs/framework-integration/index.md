# Framework Integration

While TabMate's core library is framework-agnostic and can be used with any JavaScript framework or vanilla JavaScript, it provides dedicated packages with native integrations for popular frameworks. These integrations offer advantages over using the core library directly.

## Benefits of Native Framework Integration

**Seamless Reactivity**: Native integrations leverage each framework's reactivity system, automatically updating TabMate configurations when your component data changes. No manual event handling or lifecycle management required.

**Declarative API**: Framework-specific packages provide intuitive, declarative APIs that follow each framework's conventions. Configure TabMate using familiar patterns like directives, composables, or hooks.

**Automatic Lifecycle Management**: Integrations handle component mounting, unmounting, and cleanup automatically. TabMate instances are created when components mount and properly destroyed when they unmount, preventing memory leaks.

**Type Safety**: Native packages include TypeScript support with proper type inference, providing better developer experience with autocomplete and compile-time error checking.

## Supported frameworks

Currently, the following frameworks are directly supported:

- [Vue](vue.md)

__Support for Angular and React is coming soon!__