# Coding Guidelines

1. Only work on something if it has been assigned to you from an issue.
2. The app is cross platform. Make sure that your code is not tightly coupled to a specific OS.

   - E.g. You can make use of the `window.app.isMacOS()` API

3. When creating new components on the renderer, try to write them in such that they can be inserted into storybook. Think about dependency injection.
4. Make use of ShadcnUI components as much as possible, to ensure UI consistency.
5. Make sure to justify adding new things into the store.
