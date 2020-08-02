import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Group from './Group';
import Selector from './Selector/Selector';
import { useSelector, useDispatch } from 'react-redux';
import { getLayerGroupByName } from '../../Util/mapUtil';
import { UPDATE_STORE } from '../../Store/Reducers/actionTypes';
import { CHOOSE_PROJECT } from '../../Constants/tooltips';
import { ADD_RESOURCE } from '../../Store/Reducers/actionTypes';
import { getResources, getResource } from '../../Requests/requests';

export default React.memo(function Groups(props) {
  const dataFromStore = useSelector((state) => state.data.data);
  const dispatch = useDispatch();
  const [data, setData] = useState(dataFromStore);

  useEffect(() => {
    setData(dataFromStore);
  }, [dataFromStore]);

  const fetchResource = async function (path, name) {
    const res = await getResource(path, name);
    dispatch({ type: ADD_RESOURCE, payload: { item: res.latest } });
  };

  const onDragEnd = function (result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const groupStart = data.groups[source.droppableId];
    const groupFinisih = data.groups[destination.droppableId];

    const groupLayerStart = getLayerGroupByName(
      props.map,
      source.droppableId
    ).getLayers();
    const groupLayerStartLength = groupLayerStart.getLength();

    let newData;

    if (groupStart === groupFinisih) {
      // same group
      const newItemsIds = [...groupStart.itemsIds];
      newItemsIds.splice(source.index, 1);
      newItemsIds.splice(destination.index, 0, draggableId);

      const newGroup = {
        ...groupStart,
        itemsIds: newItemsIds,
      };

      newData = {
        ...data,
        groups: {
          ...data.groups,
          [newGroup.id]: newGroup,
        },
      };
      // TODO : check order of render
      // The layers render from the begin to end so we should reverse it.
      const layerChanged = groupLayerStart.removeAt(
        groupLayerStartLength - source.index - 1
      );
      groupLayerStart.insertAt(
        groupLayerStartLength - destination.index - 1,
        layerChanged
      );
    } else {
      // Moving to another group
      const startItemsIds = Array.from(groupStart.itemsIds);
      startItemsIds.splice(source.index, 1);
      const newStart = {
        ...groupStart,
        itemsIds: startItemsIds,
      };

      const finishItemsIds = Array.from(groupFinisih.itemsIds);
      finishItemsIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...groupFinisih,
        itemsIds: finishItemsIds,
      };

      newData = {
        ...data,
        groups: {
          ...data.groups,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      const groupLayerEnd = getLayerGroupByName(
        props.map,
        destination.droppableId
      ).getLayers();
      const groupLayerEndLength = groupLayerEnd.getLength();

      const layerChanged = groupLayerStart.removeAt(
        groupLayerStartLength - source.index - 1
      );
      groupLayerEnd.insertAt(
        groupLayerEndLength - destination.index,
        layerChanged
      );
    }

    setData(newData);
    dispatch({ type: UPDATE_STORE, payload: newData });
  };

  return data ? (
    <React.Fragment>
      <Selector
        selectionKind="resource"
        dispatchFunction={fetchResource}
        checkNewSelection={false}
        levelRequest={getResources}
        itemRequest={getResource}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        {data.groupsOrder.map((groupId) => {
          const group = data.groups[groupId];
          const items = group.itemsIds;
          return <Group key={group.id} group={group} items={items} />;
        })}
      </DragDropContext>
    </React.Fragment>
  ) : (
    CHOOSE_PROJECT
  );
});
