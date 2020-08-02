import React, { useEffect, useState } from 'react';
import './App.css';
import Map from './Components/Map/Map';
import { useSelector } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function App() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const projectName = useSelector((state) => state.project.projectName);

  useEffect(() => {
    if (projectName) {
      setLoading(true);
    }
  }, [projectName]);

  return (
    <>
      <Map />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
    </>
  );
}

export default App;
