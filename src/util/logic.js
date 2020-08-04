export function isGroupChecked(state) {
  state.data.groupsOrder.forEach((groupId) => {
    const group = state.data.groups[groupId];
    let checked = true;
    checked = group.itemsIds.every(
      (itemId) => state.data.items[itemId].checked
    );
    group.checked = checked;
  });
  return state;
}

export function makeCoordinatesArrayFromString(s) {
  let arr = [];
  let splitS = s.split(',');
  arr.push(parseFloat(splitS[3]));
  arr.push(parseFloat(splitS[1]));
  arr.push(parseFloat(splitS[2]));
  arr.push(parseFloat(splitS[0]));
  return arr;
}
