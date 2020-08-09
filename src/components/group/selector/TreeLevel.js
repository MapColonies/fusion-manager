import React, { useState, useEffect } from 'react';
import pathUtil from 'path';
import { ERROR_CONTACTING_SERVER } from '../../../constants/messages/error';
import { useSnackbar } from 'notistack';
import TreeNode from './TreeNode';
import { Folder } from '@material-ui/icons';
import TreeNodeItem from './TreeNodeItem';

export default function TreeLevel(props) {
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
    if (nodes) return;
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
      <TreeNodeItem
        key={path + item}
        nodeId={path + item}
        path={path}
        name={item}
        itemRequest={itemRequest}
        clickOnList={clickOnList}
      />
    ));
  };

  return (
    nodes && (
      <TreeNode
        key={path}
        nodeId={path}
        labelText={path.substring(path.lastIndexOf('/') + 1)}
        labelIcon={Folder}
      >
        {Array.isArray(nodes.items)
          ? renderItems(props.path, nodes.items)
          : null}
        {Array.isArray(nodes.directories)
          ? nodes.directories.map((node) => (
              <TreeLevel
                key={pathUtil.join(path, node)}
                path={pathUtil.join(path, node)}
                levelRequest={levelRequest}
                itemRequest={itemRequest}
                clickOnList={clickOnList}
              />
            ))
          : null}
      </TreeNode>
    )
  );
}
