import React, { useState, useEffect } from 'react';
import TreeNode from './TreeNode';
import { Map } from '@material-ui/icons/';
import VersionSelector from './VersionSelector';
import { ERROR_CONTACTING_SERVER } from '../../../constants/messages/error';
import { useSnackbar } from 'notistack';

export default function TreeNodeItem(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [item, setItem] = useState(null);
  const [version, setVersion] = useState(null);
  const { clickOnList, name, path, itemRequest } = props;

  useEffect(() => {
    getFromServer();
  }, []);

  const getFromServer = async function () {
    // Get items from the server.
    try {
      const res = await itemRequest(path, name);
      setItem(res);
      setVersion(res.latest.version);
    } catch {
      enqueueSnackbar(ERROR_CONTACTING_SERVER.message, {
        variant: ERROR_CONTACTING_SERVER.variant,
      });
    }
  };

  const click = (newVersion) => {
    if (newVersion) {
      clickOnList({ path, name, version: newVersion });
    } else {
      clickOnList({ path, name, version });
    }
  };

  return (
    item && (
      <TreeNode
        key={path + name}
        nodeId={path + name}
        labelText={name}
        labelIcon={Map}
        color="#1a73e8"
        bgColor="#e8f0fe"
        onClick={() => click()}
        versionSelector={
          <VersionSelector
            clickOnList={click}
            versions={item.versions}
            version={version}
            setVersion={setVersion}
          />
        }
      />
    )
  );
}
