# @geoblocks/ol-comfy changes

List changes at major/minor level. Patches should be straightforward.

## 1.1.0
- Rework interactions to have generic groups to manage interactions.
- Add features in the event fired by the "setFeatureProperty" method. Add more flexibility.
- Replace "selectFeatures" with a more generic "featureAffected" method and event.
- Remove layerAdded observable; Use native collection events instead.
- Move EmptyStyle to a dedicated `src/style.ts` file.
- Remove CommonProperties from the `src/layer/layer-group.ts` file and move the `LayerUid` key into
  `src/layer/propertiy-key.ts` as `LayerUidKey`.
- Add coordinate formatting to display nice coordinates.

## v1.0.1
- Start removing lodash, better import of it.

## v1.0
- Releasing v1
