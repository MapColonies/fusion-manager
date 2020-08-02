import React, { useState, useEffect } from 'react';
import { TreeItem } from '@material-ui/lab';
import pathUtil from 'path';
import { ERROR_CONTACTING_SERVER } from '../../../Constants/Messages/error';
import { useSnackbar } from 'notistack';
import VersionSelect from './VersionSelect';

export default function VersionView(props) {
  const { enqueueSnackbar } = useSnackbar();
  const path = props.path;
  const name = props.name;
  const [item, setItem] = useState(null);
  const itemRequest = props.itemRequest;
  const isSelected = props.isSelected;
  const clickOnList = props.clickOnList;

  useEffect(() => {
    getFromServer(path);
  }, []);

  const getFromServer = async function (path, version = 0) {
    // Get items from the server.
    try {
      const res = await itemRequest(path, name);
      setItem(res);
    } catch {
      enqueueSnackbar(ERROR_CONTACTING_SERVER.message, {
        variant: ERROR_CONTACTING_SERVER.variant,
      });
    }
  };

  return (
    item && (
      <TreeItem
        key={path}
        nodeId={item.latest.name + path}
        label={item.latest.name}
      >
        {item.versions.map((version) => (
          <VersionSelect
            path={path}
            name={name}
            version={version}
            itemRequest={itemRequest}
            isSelected={isSelected}
            clickOnList={clickOnList}
          />
        ))}
      </TreeItem>
    )
  );
}
