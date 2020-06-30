import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    margin: {
        height: theme.spacing(3),
    },
}));

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
};



const PrettoSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);


export default function CustomizedSlider(props) {
    const classes = useStyles();
    const [opacity, setOpacity] = useState(100);
    const dispatch = useDispatch();

    const handleChange = (e, newValue) => {
        if (newValue !== opacity) {
            setOpacity(newValue);
            dispatch({ type: 'opacityChange', payload: { id: props.item.name, opacity: newValue } });
        }
    }

    return (
        <div className={classes.root}>
            <Typography gutterBottom>Opacity</Typography>
            <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" onChange={handleChange} value={opacity} />
        </div>
    );
}
