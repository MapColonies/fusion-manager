import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormControlLabel,
  Link,
  Avatar,
  IconButton
} from "@material-ui/core/";
import { ExpandMore, Settings, ZoomIn } from "@material-ui/icons/";
import { useSelector, useDispatch } from "react-redux";
import OpacitySlider from "./OpacitySlider";
import SettingsTabs from "../../Tabs/SettingsTabs";
import {
  TOGGLE_ITEM,
  SELECT_ITEM,
  ZOOM_TO_LAYER,
  ADD_RESOURCE,
} from "../../../Store/Reducers/actionTypes";

const useStyles = makeStyles({
  avatar: {
    display: "inline-table",
    marginRight: "5px",
    marginLeft: "-10px",
  },
  item: {
    width: "100%",
  },
});

export default React.memo(function Item(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const itemDetails = useSelector((state) => state.data.data.items[props.item]);
  const [item, setItem] = useState(null);

  useEffect(() => {
    setItem(itemDetails);
  }, [itemDetails]);

  const handleCheckboxClick = function () {
    dispatch({ type: TOGGLE_ITEM, payload: { id: item.id } });
  };

  const handleSelectItem = function (e) {
    e.stopPropagation();
    dispatch({ type: SELECT_ITEM, payload: { id: item.id } });
  };

  const handleOpenDialog = function () {
    setOpen(true);
  };

  const handleCloseDialog = function () {
    setOpen(false);
  };

  const handleZoomToLayer = function () {
    dispatch({ type: ZOOM_TO_LAYER, payload: { id: item.id } });
  };

  const addResource = function () {
    dispatch({ type: ADD_RESOURCE, payload: { item } });
  };

  return (
    <div>
      {item ? (
        <div>
          <ExpansionPanel
            TransitionProps={{ unmountOnExit: true }}
            style={{ background: item.selected ? "rgba(0, 158, 115,0.1)" : "" }}
          >
            <ExpansionPanelSummary
              style={{ textAlign: "left" }}
              {...props.provided.dragHandleProps}
              expandIcon={<ExpandMore />}
              aria-label="Expand"
              aria-controls="additional-item-content"
              id={item.name + "-expansion-panel-summary"}
            >
              <div className={classes.item}>
                <FormControlLabel
                  aria-label="item-details"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  control={
                    <Checkbox
                      checked={item.checked}
                      onClick={handleCheckboxClick}
                    />
                  }
                />
                <Avatar
                  className={classes.avatar}
                  variant="square"
                  src={item.uri}
                />
                <Link className="rasterName" onClick={handleSelectItem}>
                  {item.name}
                </Link>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <Settings />
              </IconButton>
              <IconButton
                onClick={() => {
                  handleZoomToLayer();
                }}
              >
                <ZoomIn />
              </IconButton>
              <OpacitySlider item={item} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <SettingsTabs
            // itemId={item.name}
            item={item}
            // src={item.uri}
            // extent={item.extent}
            open={open}
            close={handleCloseDialog}
          />
        </div>
      ) : (
        <div {...props.provided.dragHandleProps}></div>
      )}
    </div>
  );
});
