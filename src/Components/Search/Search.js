import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { searchProjects, searchResources } from "../../General/Requests";
import { RESOURCE } from "../../Constants/models";

const useStyles = makeStyles({
  root: {
    height: 500,
    flexGrow: 1,
  },
});

export default function Search(props) {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Wanted model for searching (resource / project)
  const model = props.model;
  // Set search function by given model
  const searchFunction = model === RESOURCE ? searchResources : searchProjects;

  useEffect(() => {}, [searchResults]);

  //Search for every keystroke the user inserts
  // useEffect(() => {
  //     // Set to no results if empty search
  //     if(searchText === '') {
  //         setSearchResults([]);
  //         return;
  //     }

  //     search(searchText);
  // }, [searchText]);

  const search = async function () {
    try {
      const results = await searchFunction(searchText);
      setSearchResults(results[model + "s"]);
    } catch (error) {
      // TODO: add error to logger
    }
  };

  return (
    <div>
      <TextField
        onChange={(event) => setSearchText(event.target.value)}
      ></TextField>
      <Button onClick={search}>Click me!</Button>
      {searchResults && (
        <List>
          {searchResults.map((path, index) => (
            <ListItem
              button
              key={index}
              onClick={() => props.handleSelect(path)}
            >
              <ListItemText>{path}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
