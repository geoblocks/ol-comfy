# @geoblocks/ol-comfy changes

List changes at major/minor level. Patches should be straightforward.

# 2.0.0
- Stop adding breaking changes in minor versions.
- Drop RXJS, use ol/native mechanisms instead.
- Remove the UnByKeyAll method, you can use the native ol/Observable.unByKeyAll method instead.

# 1.4.0
- Remove lodash.
- Use the same uid system between Interaction and LayerGroup.
  - Drop LayerUidKey, add olcUidKey instead.
- Add setLayerProperty method in LayerGroup
- Remove nearly useless interaction classes.
- Add draw box interaction and related example.

# 1.3.0
- Add getFirstVisible() in the background-layer-group class.
- Add Generic layerAffected and layerPropertyChanged events on the layer-group class to
  be able to listen to layer change without observing each layer itself.

# 1.2.0
- Rework `coordinatesToTemplate` to take only number coordinates 
  and format numbers to string with the provided functions (that's more flexible).
- Fix single coordinate formatting for DMS format.

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
