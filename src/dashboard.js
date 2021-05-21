import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid, InputBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import './dashboard.css';
import { Logo, Name } from './globals';
import SchemeViewer from './schemeviewer';

const fs = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-font-size');
const bg = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
const sw = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-width');

/* mostly from https://material-ui.com/components/app-bar/ */
const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    marginRight: theme.spacing(6),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(hc, 0.15),
    transitionDuration: "0.3s",
    border: "none",
    width: "100%",
    '&:hover': {
      backgroundColor: fade(hc, 0.25),
    },
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: "17ch",
      '&:focus': {
        width: '22ch',
      },
    },
  },
  colorButton: {
    boxShadow: 'none',
    display: "block",
	  padding: "0.7em",
    margin: "0.3em",
    width: `calc(${sw} * 2/3 + 1.5vw)`,
    textAlign: "left",
    fontSize: fs,
    border: "none",
    backgroundColor: bg,
    '&:hover': {
      backgroundColor: hc,
    }
  }
}));

function Header(props) {
  function brand() {
    return (
      <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
        <div className="App-brand">
            <img src={Logo} className="App-logo" alt="logo" />
            <p>{Name}</p>
        </div>
      </Link>
    );
  }
  return (
    <header className="App-header">
      {brand()}
      {props.searchBar()}
    </header>
  );
}

function SideMenu(props) {
  const classes = useStyles();
  return (
      <Grid className="SideMenu">
        <h className="SideMenu-h">SCHEMING</h>
        <Button className={classes.colorButton} onClick={props.onClickMySchemes}>My Schemes</Button>
        <Button className={classes.colorButton} onClick={props.onClickBrowseSchemes}>Browse Schemes</Button>
        <Button className={classes.colorButton} onClick={props.onClickUnivSchemes}>My Univ's Schemes</Button>
        <h className="SideMenu-h">ACCOUNT</h>
        <Button className={classes.colorButton} onClick={props.onClickProfile}>Profile</Button>
      </Grid> 
  );
}

function Dashboard() {
  /*
   * Header and side panel to display links to various pages / functionality
   * Such as Scheme Creator, My Schemes, Home, Search Schemes, etc.
   * If a link is clicked in the side panel, the page / url will not change,
   * it will just load that specific window into the Scheme viewer
   */

  const classes = useStyles();
  const [searchQuery, updateQuery] = useState("");
  const [window, updateWindow] = useState("My Schemes");

  function searchBar() {
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        
        <form onSubmit={(e) => {
            // TODO: search database using this.state.searchQuery
            // enforce order of search as professor, uni, course
            e.preventDefault();
            alert(searchQuery);
            updateQuery("");
        }}>
          <InputBase
            placeholder="Search schemes..."
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            type="search"
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => updateQuery(e.target.value)}
          />
        </form>
      </div>
    );
  }

  return (
    <div>
      {Header({searchBar: searchBar})}
      <div className="App-bottom">
        {SideMenu({})}
        <SchemeViewer header={window} />
      </div>
    </div>
  );
}

export default Dashboard;
