import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Item from './item/ItemContainer';
import { Droppable } from 'react-beautiful-dnd';

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core/';
import { ExpandMore } from '@material-ui/icons/';
import { useDispatch } from 'react-redux';
import { TOGGLE_GROUP } from '../../store/reducers/actionTypes';

const useStyles = makeStyles({
  items: {
    padding: '0px',
    maxHeight: '500px',
    width: '100%',
    overflow: 'auto',
  },
});

const InnerList = React.memo(function list(props) {
  return props.items.map((item, index) => (
    <Item key={item} item={item} index={index} />
  ));
});

export default React.memo(function Group(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [initial, setInitial] = useState(true);
  const dispatch = useDispatch();

  const handleCheckboxClick = function () {
    dispatch({ type: TOGGLE_GROUP, payload: { id: props.group.id } });
  };

  useEffect(() => {
    if (initial) {
      if (props.items.length < 10) {
        setHasMore(false);
        setItems(props.items);
      } else {
        setHasMore(true);
        setItems(props.items.slice(0, 11));
      }
      setInitial(false);
    } else {
      setItems(
        props.items.slice(
          0,
          props.items.length - 1 === items.length
            ? props.items.length
            : items.length
        )
      );
    }
  }, [props.items]);

  const loadMore = function () {
    if (items.length < props.items.length && hasMore) {
      const newItems =
        props.items.length > items.length + 10
          ? props.items.slice(0, items.length + 10)
          : props.items;
      setItems(newItems);
    } else {
      setHasMore(false);
    }
  };

  const handleScroll = function (e) {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      loadMore();
    }
  };

  return (
    <ExpansionPanel onClick={() => setExpanded(true)}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-label="Expand"
        aria-controls="group-content"
        id={props.group.id + '-expansion-panel-summary'}
      >
        <FormControlLabel
          aria-label="group-details"
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          control={
            <Checkbox
              checked={props.group.checked}
              onClick={handleCheckboxClick}
            />
          }
          label={props.group.title}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{ 'min-height': '100px' }}
        onScroll={(e) => {
          handleScroll(e);
        }}
      >
        {expanded && (
          <Droppable droppableId={props.group.id}>
            {(provided) => (
              <div
                className={classes.items}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <InnerList items={items} />

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});
