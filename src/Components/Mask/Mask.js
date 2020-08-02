import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Switch,
} from '@material-ui/core/';
import Done from '@material-ui/icons/Done';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useSnackbar } from 'notistack';
import { UPDATE_MASK } from '../../Store/Reducers/actionTypes';

const useStyles = makeStyles({
  band: {
    justifyContent: 'space-around',
  },
});

export default function Mask(props) {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [feather, setFeather] = useState(props.item.mask.feather);
  const [holesize, setHolesize] = useState(props.item.mask.hole_size);
  const [tolerance, setTolerance] = useState(props.item.mask.threshold); // TODO: should be tolerance
  const [band, setBand] = useState(props.item.mask.band.toString());
  const [whiteFill, setWhiteFill] = useState(
    props.item.mask.white_fill === 1 ? true : false
  );
  const [sourceDate, setSourceDate] = useState(props.item.takenAt);

  const dispatch = useDispatch();

  useEffect(() => {}, [
    feather,
    holesize,
    tolerance,
    band,
    whiteFill,
    sourceDate,
  ]);

  const handleChangeBand = function (e) {
    setBand(e.target.value);
  };

  const handleChangeWhiteFill = function () {
    setWhiteFill(!whiteFill);
  };

  const handleChangeSourceDate = function (date) {
    setSourceDate(date);
  };

  const handleChangeFeather = function (e) {
    if (e === '' || parseInt(e) < 0) {
      setFeather(0);
      return;
    }
    if (parseInt(e) > 255) {
      setFeather(255);
      return;
    }
    if (e.length > 1 && e[0] === '0') {
      let withoutZero = e.substring(1);
      setFeather(withoutZero);
      return;
    }
    setFeather(parseInt(e));
  };

  const handleChangeHolesize = function (e) {
    if (e === '' || parseInt(e) < 0) {
      setHolesize(0);
      return;
    }
    if (parseInt(e) > 100000) {
      setHolesize(100000);
      return;
    }
    if (e.length > 1 && e[0] === '0') {
      let withoutZero = e.substring(1);
      setHolesize(withoutZero);
      return;
    }
    setHolesize(parseInt(e));
  };

  const handleChangeTolerance = function (e) {
    if (e === '' || parseInt(e) < 0) {
      setTolerance(0);
      return;
    }
    if (parseInt(e) > 255) {
      setTolerance(255);
      return;
    }
    if (e.length > 1 && e[0] === '0') {
      let withoutZero = e.substring(1);
      setTolerance(withoutZero);
      return;
    }
    setTolerance(parseInt(e));
  };

  const updateMask = function () {
    dispatch({
      type: UPDATE_MASK,
      payload: {
        id: props.item.id,
        feather,
        holesize,
        tolerance,
        band,
        whiteFill,
        sourceDate,
      },
    });
    enqueueSnackbar('Mask updated successfully', { variant: 'success' });
  };

  return (
    <div>
      <Grid container spacing={5} justify="center" alignItems="center">
        <Grid item xs={6}>
          <FormLabel component="legend">Source date</FormLabel>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              value={sourceDate}
              onChange={handleChangeSourceDate}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={6}>
          <FormLabel component="legend">Band</FormLabel>
          <RadioGroup
            row
            aria-label="band"
            value={band}
            className={classes.band}
            onChange={handleChangeBand}
          >
            <FormControlLabel value="0" control={<Radio />} label="Red" />
            <FormControlLabel value="1" control={<Radio />} label="Green" />
            <FormControlLabel value="2" control={<Radio />} label="Blue" />
          </RadioGroup>
        </Grid>

        <Grid item xs={6}>
          <FormLabel component="legend">Feather</FormLabel>
          <TextField
            value={feather}
            onChange={(e) => handleChangeFeather(e.target.value)}
            id="feather"
            variant="outlined"
            size="small"
            type="number"
            required={true}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <FormLabel component="legend">Hole size</FormLabel>
          <TextField
            value={holesize}
            onChange={(e) => handleChangeHolesize(e.target.value)}
            id="holesize"
            variant="outlined"
            size="small"
            type="number"
            required={true}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <FormLabel component="legend">Tolerance</FormLabel>
          <TextField
            value={tolerance}
            onChange={(e) => handleChangeTolerance(e.target.value)}
            id="tolerance"
            variant="outlined"
            size="small"
            type="number"
            required={true}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <FormLabel component="legend">White fill</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={whiteFill}
                onChange={handleChangeWhiteFill}
                name="whileFill"
              />
            }
          />
        </Grid>

        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Done />}
            color="primary"
            onClick={() => updateMask()}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
