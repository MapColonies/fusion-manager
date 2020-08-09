import React from 'react';
import { Select, MenuItem } from '@material-ui/core/';

export default function VersionSelector(props) {
  const { version, versions, setVersion, clickOnList } = props;

  const handleChange = function (e) {
    const newVersion = e.target.value;
    setVersion(newVersion);
    clickOnList(newVersion);
  };

  return (
    version && (
      <Select
        onClick={(e) => e.stopPropagation()}
        value={version}
        onChange={handleChange}
      >
        {versions.map((version) => (
          <MenuItem key={version} value={version}>
            {' '}
            {version}{' '}
          </MenuItem>
        ))}
      </Select>
    )
  );
}
