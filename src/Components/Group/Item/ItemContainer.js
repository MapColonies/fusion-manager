import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';
import Item from './Item';

const useStyles = makeStyles({
  root: {
    padding: '8px',
    marginBottom: '8px',
    background: 'white',
  },
});

export default React.memo(function ItemContainer(props) {
  const classes = useStyles();

  return (
    // wrap the drag area, provided adds props and ref that react-beautiful-dnd needs

    <Draggable draggableId={props.item} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          className={classes.root}
          ref={provided.innerRef}
        >
          <Item item={props.item} provided={provided} />
        </div>
      )}
    </Draggable>
  );
});
