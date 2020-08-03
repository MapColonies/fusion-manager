import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerImage from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlLayerGroup from 'ol/layer/Group';
import {
  DEFAULT_PROJECTION,
  DEFAULT_ZOOM,
  MAP_CENTER,
} from '../config/mapConfig';
import {
  BASE_LAYER_NAME,
  BASE_LAYER_GROUP,
  GROUP_PREFIX,
} from '../constants/map';

export function getLayerByName(map, name) {
  const mapLayers = map.getLayerGroup().getLayersArray();
  return mapLayers.filter((layer) => layer.get('name') === name)[0];
}

export function getLayerGroupByName(map, name) {
  const mapLayersGroup = map.getLayers().getArray();
  return mapLayersGroup.filter((layer) => layer.get('name') === name)[0];
}

export function getHoverLayer(map) {
  const mapLayers = map.getLayerGroup().getLayersArray();
  return mapLayers.filter((layer) => layer.get('name').includes('hover'))[0];
}

export function addHoverLayer(map, name) {
  const layer = getLayerByName(map, name);
  const newLayerWithHover = new OlLayerImage({
    name: layer.get('name') + ' hover',
    opacity: layer.getOpacity(),
    className: 'layerHover',
    source: new Static({
      url: layer.getSource().getUrl(),
      projection: DEFAULT_PROJECTION,
      imageExtent: layer.getSource().getImageExtent(),
    }),
  });
  map.getLayers().push(newLayerWithHover);
}

// set a visibility to a layer group
export function setVisibleGroup(map, groupName, visibility) {
  map
    .getLayers()
    .getArray()
    .find((group) => group.get('name') === groupName)
    .setVisible(visibility);
}

export function clearMap(map) {
  map.getLayers().clear();
}

export function cropLayer(layer, newUri, newExtent) {
  const newSource = new Static({
    url: newUri,
    projection: DEFAULT_PROJECTION,
    imageExtent: newExtent,
  });
  layer.setSource(newSource);
}

export function getNewMap() {
  return new OlMap({
    view: new OlView({
      center: MAP_CENTER,
      projection: DEFAULT_PROJECTION,
      zoom: DEFAULT_ZOOM,
    }),
    layers: [],
  });
}

export function addBaseLayer(map) {
  const mapLayers = map.getLayers();

  const osm = new OlLayerTile({
    source: new OlSourceOsm(),
    name: BASE_LAYER_NAME,
  });
  const layerGroupOsm = new OlLayerGroup({
    name: BASE_LAYER_GROUP,
    layers: [osm],
  });

  mapLayers.push(layerGroupOsm);
}

export function addGroupToMap(map, newGroup) {
  const layersArray = map.getLayers().getArray();
  const index = layersArray.findIndex(
    (group) =>
      parseInt(group.get('name').replace(GROUP_PREFIX, '')) >=
      parseInt(newGroup.get('name').replace(GROUP_PREFIX, ''))
  );
  map.getLayers().insertAt(index, newGroup);
}

export function addResourceToMap(map, resource) {
  let group = getLayerGroupByName(map, GROUP_PREFIX + resource.level);
  let groupExists = group ? true : false;

  if (!groupExists) {
    group = new OlLayerGroup({
      name: GROUP_PREFIX + resource.level,
      layers: [],
    });
  }

  const newLayer = new OlLayerImage({
    name: resource.id,
    source: new Static({
      url: resource.uri,
      projection: DEFAULT_PROJECTION,
      imageExtent: resource.extent,
      crossOrigin: 'Anonymous',
    }),
  });

  group.getLayers().push(newLayer);

  if (!groupExists) {
    addGroupToMap(map, group);
  }
}

// add layers to map in the initial state
export function addLayersToMap(map, layers) {
  const mapLayers = map.getLayers();

  layers.groupsOrder.forEach((groupId) => {
    const itemsIds = layers.groups[groupId].itemsIds;
    const layerGroup = new OlLayerGroup({
      name: groupId,
      layers: [],
    });
    const layerGroupLayers = layerGroup.getLayers();
    let layer;
    itemsIds.forEach((itemId) => {
      const item = layers.items[itemId];
      layer = new OlLayerImage({
        name: itemId,
        source: new Static({
          url: item.uri,
          projection: DEFAULT_PROJECTION,
          imageExtent: item.extent,
          crossOrigin: 'Anonymous',
        }),
      });
      layerGroupLayers.push(layer);
    });
    mapLayers.push(layerGroup);
  });
}

export function removeResourceFromMap(map, resource) {
  const group = getLayerGroupByName(map, GROUP_PREFIX + resource.level);
  const layerToDelete = getLayerByName(map, resource.id);
  const groupLayers = group.getLayers();
  groupLayers.remove(layerToDelete);
}

export function setDraftMap(draft) {
  clearMap(draft.map);
  addBaseLayer(draft.map);
  addLayersToMap(draft.map, draft.data);
}
