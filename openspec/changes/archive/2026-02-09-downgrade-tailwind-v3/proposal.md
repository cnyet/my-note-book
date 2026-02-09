# Proposal: Downgrade Tailwind CSS to v3

## 1. Problem

Tailwind CSS v4 is currently unstable and its CSS-variable-first approach is causing rendering issues in the browser for this project. The current design depends heavily on these variables which are not performing as expected in the current environment.

## 2. Solution

Downgrade Tailwind CSS from v4 to v3.2.x to ensure stability and better browser compatibility. This involves updating the dependency list, providing a traditional `tailwind.config.js`, and updating all architectural documentation to reflect this change.

## 3. Impact

- **Frontend**: `package.json` dependencies will change. CSS structure will move from v4 approach to v3 approach.
- **Documentation**: All architecture and design guides must be updated to reference Tailwind v3.
- **Development**: Developers will use `tailwind.config.js` for theme customization instead of CSS variables in `globals.css` (though v3 also supports variables, the configuration method is different).

## 4. Affected Files

- `frontend/package.json`
- `frontend/tailwind.config.js` (to be created)
- `frontend/postcss.config.js` (to be created)
- `docs/design/architecture.md`
- `docs/design/frontend-guide.md`
- `README.md`
- `openspec/project.md`
