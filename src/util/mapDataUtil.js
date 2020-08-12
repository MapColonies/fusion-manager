import { makeCoordinatesArrayFromString } from './logic';
import { urlThumbnail } from '../config/url/serverUrls';
import { GROUP_PREFIX } from '../constants/map';

export function addToGroups(groups, resource) {
  if (!groups[GROUP_PREFIX + resource.level]) {
    groups[GROUP_PREFIX + resource.level] = {
      id: GROUP_PREFIX + resource.level,
      title: 'Level ' + resource.level,
      checked: true,
      level: resource.level,
      itemsIds: [resource.id],
    };
  } else {
    groups[GROUP_PREFIX + resource.level].itemsIds.push(resource.id);
  }
}

export function removeFromGroups(groups, resource) {
  const group = groups[GROUP_PREFIX + resource.level];
  let itemIds = group.itemsIds;
  itemIds = itemIds.filter((id) => id !== resource.id);

  group.itemsIds = itemIds;

  // remove group if it's empty
  if (itemIds.length === 0) {
    delete groups[GROUP_PREFIX + resource.level];
  }
}

export function prepareResourceForDisplay(resource) {
  resource.id = resource.search_path;
  resource.uri =
    `${urlThumbnail}name=${resource.name}&version=${resource.version}&path=${resource.search_path.slice(0, -resource.name.length)}`;
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
