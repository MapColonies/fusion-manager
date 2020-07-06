import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Crop from '../Crop/Crop'
import Mask from '../Mask/Mask';

export default function SettingsTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Dialog
            open={props.open}
            onClose={() => props.close()}
            fullWidth={true}
            maxWidth='sm'
        >

            <div className={classes.root}>
                <Tabs
                    centered
                    
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Crop" {...a11yProps(0)} />
                    <Tab label="Mask" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <Crop item={props} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Mask />
                </TabPanel>
            </div>

        </Dialog>
    );
}



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            
                <Box p={3} hidden={value !== index}>
                    {children}
                </Box>
            
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

