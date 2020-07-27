import { makeCoordinatesArrayFromString } from "../General/Logic";
import Config from "../General/Config";

export function addToGroups(groups, resource) {
  if (!groups["level-" + resource.level]) {
    groups["level-" + resource.level] = {
      id: "level-" + resource.level,
      title: "Level " + resource.level,
      checked: true,
      level: resource.level,
      itemsIds: [resource.name],
    };
  } else {
    groups[resource.level].itemIds.push(resource.name);
  }
}

export function removeFromGroups(groups, resource) {
  const group = groups["level-" + resource.level];
  let itemIds = group.itemsIds;
  itemIds = itemIds.filter((id) => id !== resource.name);

  group.itemsIds = itemIds;

  // remove group if it's empty
  if (itemIds.length === 0) {
    delete groups["level-" + resource.level];
  }
}

export function prepareResourceForDisplay(resource) {
  resource.uri =
    Config.urlThumbnail +
    "name=" +
    resource.name +
    "&version=" +
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
