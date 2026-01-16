# Changelog

<br />

### Jan 16, 2026
- Added `tanStackTable` component from `kolar`.
- Styled the `/` & `/changelog` routes to use Grafana Theme.
- Added TailwindCSS to the project to speed-up & clean-up the CSS-writing chores.

<br />

### Jan 15, 2026
- Created a `components` folder to house custom UI components used across vuSmartMaps. The `utility` folder within `components` houses utility components–shared, non-product components used by supporting pages or non-product surfaces. A README for the same exists as well.
- Added the type-styles used in Figma into the codebase.
- Added a markdown changelog and a `/changelog` view with a simple renderer. For every change I make (accepting Cursor recommendations), it'll get appended here automatically. Additionally, as part of my workflow, I can manually modify/add entries after every major change that I introduce.
- Installed a package to render changelog.<br/>`npm i marked`
- Installed Grafana UI components that our dev team uses.<br />`npm i @grafana/ui@11.2.2`
