import React, { useState } from 'react';
import { PhotoLibrary, Save } from '@material-ui/icons/';
import { useDispatch } from 'react-redux';
import { Tooltip, IconButton, Dialog, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeInnerView from './TreeView';
import { createUniqueName } from '../../../util/treeUtil';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 500,
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function Selector(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const selectionKind = props.selectionKind;
  const dispatchFunction = props.dispatchFunction;
  const checkNewSelection = props.checkNewSelection;
  const [lastSelectionName, setLastSelectionName] = useState(null);
  const levelRequest = props.levelRequest;
  const itemRequest = props.itemRequest;
  const [loading, setLoading] = useState(false);

  const isSelected = function (versionAndPath) {
    return (
      selection &&
      versionAndPath ===
        createUniqueName(selection.path, selection.item.version)
    );
  };

  const toggleDialog = function () {
    setOpen(!open);
  };

  const handleClickOnList = function (item) {
    setSelection(item);
  };

  const handleSaveChanges = function () {
    setLoading(true);
    dispatchFunction(selection.path, selection.item.name, dispatch);
    setLastSelectionName(
      createUniqueName(selection.path, selection.item.version)
    );
    toggleDialog();
    setLoading(false);
  };

  return (
    <div>
      <Tooltip title={`Select ${selectionKind}`}>
        <IconButton onClick={() => toggleDialog()}>
          <PhotoLibrary />
        </IconButton>
      </Tooltip>
      <Dialog
        keepMounted
        open={open}
        onClose={() => toggleDialog()}
        fullWidth={true}
        maxWidth="sm"
      >
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeInnerView
            path={'/'}
            levelRequest={levelRequest}
            itemRequest={itemRequest}
            clickOnList={handleClickOnList}
            isSelected={isSelected}
          />
        </TreeView>
        {selection &&
          (!checkNewSelection ||
            lastSelectionName !==
              createUniqueName(selection.path, selection.item.version)) && (
            <Tooltip title={`Select ${selectionKind}`}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={() => handleSaveChanges()}
              >
                Save changes
              </Button>
            </Tooltip>
          )}
      </Dialog>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
}
