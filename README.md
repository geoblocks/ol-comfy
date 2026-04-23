# ol-comfy

[![CI](https://github.com/geoblocks/ol-comfy/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/geoblocks/ol-comfy/actions/workflows/ci.yml)

Comfortable and convenient Openlayers helpers for standard usages.

This library provides interfaces to ease common usage of Openlayers in a web application using web-components. It:

- Adds identifier to layers, interactions and controls to be able to get and manage them in every component.
- Adds some observables for features. They are accessible in the group, and you don't need to
  follow the feature or the layer itself to be noticed by a change.
- Simplifies the interactions: enable one tool at once, manage interactions by group (create, store, destroy, toggle).
- Add some utils, shortcuts and helpers function.

Ol-Comfy is built in a non-binding manner: take only what you need, extend what you need. Every class is responsible for what
they manage and store/retrieve information in/from the map. This way you can destroy an instance, create another one and find
again the same state. Take a look at the [wiki](https://github.com/geoblocks/ol-comfy/wiki) to see an example of architecture
using ol-comfy.

## Online doc and demos

- [Documentation](https://geoblocks.github.io/ol-comfy/apidoc/index.html);
- [Examples](https://geoblocks.github.io/ol-comfy/examples/index.html);
- [Wiki](https://github.com/geoblocks/ol-comfy/wiki).
- [Source code](https://github.com/geoblocks/ol-comfy)
- [Changelog](https://github.com/geoblocks/ol-comfy/blob/main/CHANGELOG.md)

## Local development

You can play with the examples by cloning this repo and running:

```bash
npm install
npm run dev
```

## Publish a new version to npm

The source is transpiled to standard ES modules and published on npm.

```bash
# Update the `CHANGES.md` file
# Update the `vite.config.ts` file if you have new example files.
npm run build
npm version patch/minor/major
npm publish
git push --tags origin main
npm run gh-pages
```
