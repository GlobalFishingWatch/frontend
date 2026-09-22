# apps/image-labeler/src/features/project/Task.tsx · [[image-labeler-task-labeling-ui]]

Provides a React component for displaying and labeling image tasks with keyboard shortcuts, metadata display, and label submission.

- TaskProps · type · L14-L24 — Defines the props interface for the Task component, specifying project context, task data, UI state, and image display options.
- Task · function · L26-L169 — Renders an interactive labeling interface that displays task images, metadata, and label options while handling keyboard input and task submission.
- handleKeyDown · function · L62-L72 — Maps numeric keyboard keys to label selection and Escape to task skip, enabling efficient keyboard-driven labeling workflow.
