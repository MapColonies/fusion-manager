import React, { useState, useEffect } from 'react';
import { TreeItem } from '@material-ui/lab';
import { ERROR_CONTACTING_SERVER } from '../../../Constants/Messages/error';
import { useSnackbar } from 'notistack';
import { createUniqueName } from '../../../Util/treeUtil';

export default function VersionView(props) {
  const { enqueueSnackbar } = useSnackbar();
  const path = props.path;
  const name = props.name;
  const version = props.version;
  const [item, setItem] = useState(null);
  const itemRequest = props.itemRequest;
  const isSelected = props.isSelected;
  const clickOnList = props.clickOnList;

  useEffect(() => {
    getFromServer(path);
  }, []);

  const getFromServer = async function (path) {
    // Get items from the server.
    try {
      const res = await itemRequest(path, name, version);
      setItem(res);
    } catch {
      enqueueSnackbar(ERROR_CONTACTING_SERVER.message, {
        variant: ERROR_CONTACTING_SERVER.variant,
      });
    }
  };

  //   const selectItem = async function (version) {
  //     await getFromServer(path, version);
  //     clickOnList({ path, item });
  //   };

  return (
    <TreeItem
      selected={isSelected(createUniqueName(path, version))}
      key={path}
      nodeId={version + path}
      label={version}
      onClick={() => clickOnList({ path, item })}
    />
  );
}
