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
} from '../../Util/mapUtil';
import {
  addToGroups,
  removeFromGroups,
  prepareResourceForDisplay,
  setDraftData,
} from '../../Util/mapDataUtil';
import {
  INITIALIZE_STORE,
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

let defaultState = {
  data: null,
  selected: null,
  map: getNewMap(),
};
addBaseLayer(defaultState.map);

export default function (state = defaultState, action) {
  switch (action.type) {
    // Fires when data arrived from server
    case INITIALIZE_STORE:
      return produce(state, (draft) => {
        const resources = action.payload;
        const groups = {};
        const items = {};

        // convert data from the server for open layers and react dnd
        resources.forEach((resource) => {
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
      const groupChecked = !state.data.groups[action.payload.id].checked;
      setVisibleGroup(state.map, action.payload.id, groupChecked);
      return produce(state, (draft) => {
        draft.data.groups[action.payload.id].checked = groupChecked;
      });

    // Fires when user select an item
    case SELECT_ITEM: {
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
      const layer = getLayerByName(state.map, action.payload.id);
      const cheked = !layer.getVisible();
      layer.setVisible(cheked);
      return produce(state, (draft) => {
        draft.data.items[action.payload.id].checked = cheked;
      });
    }

    case CHANGE_OPACITY: {
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
      const layer = getLayerByName(state.map, action.payload.id);
      state.map
        .getView()
        .fit(layer.getSource().getImageExtent(), { duration: 1000 });
      return state;
    }

    case UPDATE_MASK: {
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
      return produce(state, (draft) => {
        const resource = action.payload.item;
        // const resource = {
        //   name: "SFBayAreaLanSat_20021010",
        //   level: "8",
        //   version: "1",
        //   extent: "38.464679718017578,36.454353332519531,-120.71331024169922,-123.53061676025391",
        //   search_path: "/hello/SFBayAreaLanSat_20021010",
        //   mask: {
        //     no_mask: true
        //   }
        // };
        const groups = draft.data['groups'];
        const items = draft.data.items;

        prepareResourceForDisplay(resource);
        items[resource.id] = resource;

        addToGroups(groups, resource);
        setDraftData(draft, items, groups);
        addResourceToMap(state.map, resource);
      });

    case REMOVE_RESOURCE:
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
