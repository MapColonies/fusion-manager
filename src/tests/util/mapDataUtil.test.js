import {
  addToGroups,
  removeFromGroups,
  prepareResourceForDisplay,
} from '../../util/mapDataUtil';
import { makeCoordinatesArrayFromString } from '../../util/logic';

let data = {
  items: [],
  groups: {},
  groupsOrder: [],
};

let resource = {
  name: 'resource',
  level: '8',
  version: '1',
  extent: '90,180,90,180',
};

test('Add resource to group', () => {
  addToGroups(data.groups, resource);
  expect(data.groups).toEqual({
    'level-8': {
      id: 'level-8',
      title: 'Level 8',
      checked: true,
      level: '8',
      itemsIds: ['resource'],
    },
  });
});

test('Remove resource from group', () => {
  removeFromGroups(data.groups, resource);
  expect(data.groups).toEqual({});
});

test('Prepare resource for display', () => {
  const extent = makeCoordinatesArrayFromString(resource.extent);
  prepareResourceForDisplay(resource);
  expect(resource).toEqual({
    name: resource.name,
    level: resource.level,
    version: resource.version,
    uri: `http://localhost:8000/imagery/resource/image/?name=${resource.name}&version=${resource.version}`,
    checked: true,
    selected: false,
    opacity: 100,
    extent: extent,
  });
});
