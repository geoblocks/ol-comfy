# ol-comfy

[![CI](https://github.com/geoblocks/ol-comfy/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/geoblocks/ol-comfy/actions/workflows/ci.yml)

Comfortable and convenient Openlayers helpers for standard usages.

This library provides a good help to answer common Openlayers needs in a web application using web-components:

- Adds identifier to layers, interactions and controls to be able to get and manage them in every component.
- Add some observables for features. They are accessible in the group, and you don't need to
  follow the feature or the layer itself to be noticed by a change.
- Simplify interactions: enable one tool at once, manage interactions by group (create, store, destroy, toggle).
- Add some utils, shortcuts and helpers function.

Ol-Comfy is built in a non-binding manner: take only what you need, extend what you need. Every class is responsible for what
they manage and store/retrieve information in/from the map. This way you can destroy an instance, create another one and find
again the same state.

## Online doc and demos

- [Documentation](https://geoblocks.github.io/ol-comfy/apidoc/index.html);
- [Demo](https://geoblocks.github.io/ol-comfy/examples/index.html);
- [Source code](https://github.com/geoblocks/ol-comfy)

## Local development

For local development we use a few demos.

```bash
npm install
npm run dev
```

## Publish a new version to npm

The source is transpiled to standard ES modules and published on npm.

```bash
# update CHANGES.md
npm version patch
npm publish
git push --tags origin main
npm run gh-pages
```
