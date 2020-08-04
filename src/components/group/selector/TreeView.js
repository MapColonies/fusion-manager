import React, { useState, useEffect } from 'react';
import { TreeItem } from '@material-ui/lab';
import pathUtil from 'path';
import { ERROR_CONTACTING_SERVER } from '../../../constants/messages/error';
import { useSnackbar } from 'notistack';
import VersionView from './VersionView';

export default function TreeView(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [nodes, setNodes] = useState(null);
  const path = props.path;
  const levelRequest = props.levelRequest;
  const itemRequest = props.itemRequest;
  const clickOnList = props.clickOnList;
  const isSelected = props.isSelected;

  useEffect(() => {
    getFromServer(path);
  }, []);

  const getFromServer = async function (path) {
    // Get items from the server.
    try {
      const res = await levelRequest(path);
      setNodes(res);
    } catch {
      enqueueSnackbar(ERROR_CONTACTING_SERVER.message, {
        variant: ERROR_CONTACTING_SERVER.variant,
      });
    }
  };

  const renderItems = function (path, items) {
    return items.map((item) => (
      <VersionView
        path={path}
        name={item}
        itemRequest={itemRequest}
        isSelected={isSelected}
        clickOnList={clickOnList}
      />
    ));
  };

  return (
    nodes && (
      <TreeItem
        key={path}
        nodeId={path}
        label={path.substring(path.lastIndexOf('/') + 1)}
      >
        {Array.isArray(nodes.items)
          ? renderItems(props.path, nodes.items)
          : null}
        {Array.isArray(nodes.directories)
          ? nodes.directories.map((node) => (
              <TreeView
                path={pathUtil.join(path, node)}
                levelRequest={levelRequest}
                itemRequest={itemRequest}
                clickOnList={clickOnList}
                isSelected={isSelected}
              />
            ))
          : null}
      </TreeItem>
    )
  );
}
