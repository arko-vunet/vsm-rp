# Changelog

### Jan 15, 2026
- Created a `components` folder to house custom UI components used across vuSmartMaps. The `utility` folder within `components` houses utility components–shared, non-product components used by supporting pages or non-product surfaces. A README for the same exists as well.<br />Files: `src/components`, `src/components/README.md`, `src/components/utility`
- Added the type-styles used in Figma into the codebase.<br />Files: `src/styles/typography.css`
- Added a markdown changelog and a `/changelog` view with a simple renderer. For every change I make (accepting Cursor recommendations), it'll get appended here automatically. Additionally, as part of my workflow, I can manually modify/add entries after every major change that I introduce.<br />Files: `public/changelog.md`, `src/App.jsx`
- Installed a package to render changelog.<br/>`npm i marked`
- Installed Grafana UI components that our dev team uses.<br />`npm i @grafana/ui@11.2.2`
