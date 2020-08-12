import produce from 'immer';
import {
  clearMap,
  cropLayer,
  getNewMap,
  getLayerByName,
  addHoverLayer,
  getHoverLayer,
  setVisibleGroup,
  setDraftMap,
  addResourceToMap,
  removeResourceFromMap,
  addBaseLayer,
} from '../../util/mapUtil';
import {
  addToGroups,
  removeFromGroups,
  prepareResourceForDisplay,
  setDraftData,
} from '../../util/mapDataUtil';
import {
  UPDATE_PROJECT,
  UPDATE_STORE,
  INITIALIZE_MAP,
  TOGGLE_GROUP,
  TOGGLE_ITEM,
  SELECT_ITEM,
  CHANGE_OPACITY,
  CROP,
  ZOOM_TO_LAYER,
  UPDATE_MASK,
  ADD_RESOURCE,
  REMOVE_RESOURCE,
} from './actionTypes';
import logger from '../../logger';

let defaultState = {
  data: null,
  selected: null,
  map: getNewMap(),
};
addBaseLayer(defaultState.map);

export default function (state = defaultState, action) {
  switch (action.type) {
    // Fires when data arrived from server
    case UPDATE_PROJECT:
      logger.debug('Updating project');
      return produce(state, (draft) => {
        const resources = action.payload;
        const groups = {};
        const items = {};

        // convert data from the server for open layers and react dnd
        resources.forEach((resource) => {
          logger.debug('Adding resource to map groups', { resource });
          prepareResourceForDisplay(resource);
          items[resource.id] = resource;
          addToGroups(groups, resource);
        });

        // set changes
        setDraftData(draft, items, groups);
        setDraftMap(draft);
      });

    // Fires when a user changes the order of items
    case UPDATE_STORE:
      return produce(state, (draft) => {
        draft.data = action.payload;
      });

    // Fires when map object is ready
    case INITIALIZE_MAP:
      return produce(state, (draft) => {
        clearMap(draft.map);
        addBaseLayer(draft.map);
      });

    //Fires when user click on group check
    // (toogle group visibility)
    case TOGGLE_GROUP:
      logger.debug('Toggling group', { group: action.payload.id });
      const groupChecked = !state.data.groups[action.payload.id].checked;
      setVisibleGroup(state.map, action.payload.id, groupChecked);
      return produce(state, (draft) => {
        draft.data.groups[action.payload.id].checked = groupChecked;
      });

    // Fires when user select an item
    case SELECT_ITEM: {
      logger.debug('Selecting item', { itemId: action.payload.id });
      return produce(state, (draft) => {
        const lastSelectedItemId = Object.keys(draft.data.items).find(
          (itemId) => {
            return draft.data.items[itemId].selected;
          }
        );
        if (lastSelectedItemId) {
          const layerToDelete = getHoverLayer(state.map);
          state.map.removeLayer(layerToDelete);
          draft.data.items[lastSelectedItemId].selected = false;
        }

        if (lastSelectedItemId !== action.payload.id) {
          addHoverLayer(state.map, action.payload.id);
          draft.data.items[action.payload.id].selected = true;
        }
      });
    }

    // Fires when user click on item check (make item visible or not)
    case TOGGLE_ITEM: {
      logger.debug('Toggling item', { group: action.payload.id });
      const layer = getLayerByName(state.map, action.payload.id);
      const cheked = !layer.getVisible();
      layer.setVisible(cheked);
      return produce(state, (draft) => {
        draft.data.items[action.payload.id].checked = cheked;
      });
    }

    case CHANGE_OPACITY: {
      logger.debug('Changing opacity', { layer: action.payload.id });

      const layer = getLayerByName(state.map, action.payload.id);

      layer.setOpacity(action.payload.opacity / 100);
      const hoveredLayer = getLayerByName(
        state.map,
        action.payload.id + ' hover'
      );

      if (hoveredLayer) {
        hoveredLayer.setOpacity(action.payload.opacity / 100);
      }
      return produce(state, (draft) => {
        draft.data.items[action.payload.id].opacity = action.payload.opacity;
      });
    }

    case CROP: {
      logger.debug('Cropping image', { item: action.payload.id });

      return produce(state, (draft) => {
        draft.data.items[action.payload.id].newUri = action.payload.newUri;
        draft.data.items[action.payload.id].newExtent =
          action.payload.newExtent;
        draft.data.items[action.payload.id].lastCrop = action.payload.crop;
        const layer = getLayerByName(state.map, action.payload.id);
        const hoverLayer = getLayerByName(
          state.map,
          action.payload.id + ' hover'
        );

        cropLayer(layer, action.payload.newUri, action.payload.newExtent);
        // Check if hover layer exists
        if (hoverLayer) {
          cropLayer(
            hoverLayer,
            action.payload.newUri,
            action.payload.newExtent
          );
        }
      });
    }

    case ZOOM_TO_LAYER: {
      logger.debug('Zooming to layer', { layer: action.payload.id });

      const layer = getLayerByName(state.map, action.payload.id);
      state.map
        .getView()
        .fit(layer.getSource().getImageExtent(), { duration: 1000 });
      return state;
    }

    case UPDATE_MASK: {
      logger.debug('Updating mask', { itemId: action.payload.id });

      return produce(state, (draft) => {
        draft.data.items[action.payload.id].mask.feather =
          action.payload.feather;
        draft.data.items[action.payload.id].mask.hole_size =
          action.payload.holesize;
        // TODO: should betolerance
        draft.data.items[action.payload.id].mask.threshold =
          action.payload.tolerance;
        draft.data.items[action.payload.id].mask.band = parseInt(
          action.payload.band
        );
        draft.data.items[action.payload.id].mask.white_fill = ~~action.payload
          .whiteFill;
        draft.data.items[action.payload.id].takenAt = action.payload.sourceDate;
      });
    }

    case ADD_RESOURCE:
      logger.debug('Adding resource', { resource: action.payload.item });

      return produce(state, (draft) => {
        const resource = action.payload.item;
        const groups = draft.data['groups'];
        const items = draft.data.items;

        prepareResourceForDisplay(resource);
        items[resource.id] = resource;

        addToGroups(groups, resource);
        setDraftData(draft, items, groups);
        addResourceToMap(state.map, resource);
      });

    case REMOVE_RESOURCE:
      logger.debug('Removing resource', { resource: action.payload.item });

      return produce(state, (draft) => {
        const resource = action.payload.item;
        const groups = draft.data['groups'];
        const items = draft.data.items;

        delete items[resource.id];
        removeFromGroups(groups, resource);
        removeResourceFromMap(state.map, resource);

        // check if should remove hover layer
        const hoverLayer = getHoverLayer(state.map);
        if (hoverLayer && hoverLayer.get('name') === resource.name + ' hover') {
          state.map.removeLayer(hoverLayer);
        }

        // save data changes
        setDraftData(draft, items, groups);
      });

    default:
      return state;
  }
}
