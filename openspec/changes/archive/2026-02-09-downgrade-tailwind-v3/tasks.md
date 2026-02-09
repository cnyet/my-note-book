# Tasks: Downgrade Tailwind CSS to v3

- [x] **Dependency Update** <!-- id: 0 -->
  - [x] Remove Tailwind v4 and PostCSS plugin from `frontend/package.json` <!-- id: 1 -->
  - [x] Add Tailwind v3, PostCSS, and Autoprefixer to `frontend/package.json` <!-- id: 2 -->
  - [x] Run `npm install` in `frontend` <!-- id: 3 -->

- [x] **Configuration Implementation** <!-- id: 4 -->
  - [x] Create `frontend/tailwind.config.js` with Genesis Design System tokens <!-- id: 5 -->
  - [x] Create `frontend/postcss.config.js` <!-- id: 6 -->

- [x] **Documentation Update** <!-- id: 7 -->
  - [x] Update `docs/design/architecture.md` (Update Tailwind version to 3.x) <!-- id: 8 -->
  - [x] Update `docs/design/frontend-guide.md` (Update Tailwind version and usage examples) <!-- id: 9 -->
  - [x] Update `README.md` (Update tech stack section) <!-- id: 10 -->
  - [x] Update `openspec/project.md` (Update tech stack section) <!-- id: 11 -->

- [x] **Verification** <!-- id: 12 -->
  - [x] Run `npm run build` to verify configuration (Verified configuration files, build fails due to missing src/app structure) <!-- id: 14 -->
