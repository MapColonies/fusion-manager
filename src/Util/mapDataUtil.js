import { makeCoordinatesArrayFromString } from './logic';
import Config from '../Config/urls';

export function addToGroups(groups, resource) {
  if (!groups['level-' + resource.level]) {
    groups['level-' + resource.level] = {
      id: 'level-' + resource.level,
      title: 'Level ' + resource.level,
      checked: true,
      level: resource.level,
      itemsIds: [resource.id],
    };
  } else {
    groups['level-' + resource.level].itemsIds.push(resource.id);
  }
}

export function removeFromGroups(groups, resource) {
  const group = groups['level-' + resource.level];
  let itemIds = group.itemsIds;
  itemIds = itemIds.filter((id) => id !== resource.id);

  group.itemsIds = itemIds;

  // remove group if it's empty
  if (itemIds.length === 0) {
    delete groups['level-' + resource.level];
  }
}

export function prepareResourceForDisplay(resource) {
  resource.id = resource.search_path;
  resource.uri =
    Config.urlThumbnail +
    'name=' +
    resource.name +
    '&version=' +
    resource.version;
  resource.checked = true;
  resource.selected = false;
  resource.opacity = 100;
  resource.extent = makeCoordinatesArrayFromString(resource.extent);
}

export function setDraftData(draft, items, groups) {
  // set the order of the groups by thier level
  const groupsOrder = Object.keys(groups).sort(
    (a, b) => groups[a].level > groups[b].level
  );
  draft.data = { items, groups, groupsOrder };
}
