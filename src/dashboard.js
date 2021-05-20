import React from 'react';
import { Link } from "react-router-dom";
import { Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import './dashboard.css';
import { Logo, Name } from './globals';
import SchemeViewer from './schemeviewer';

const fs = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-font-size');
const bg = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');
const sw = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-width');

class Header extends React.Component {

  renderBrand() {
    // edit header font color here
    return (
      <Link to="/" style={{textDecoration: 'none', color: 'black'}}>
        <div className="App-brand">
            <img src={Logo} className="App-logo" alt="logo" />
            <p>{Name}</p>
        </div>
      </Link>
    );
  }

  render() {
    return (
      <header className="App-header">
        {this.renderBrand()}
        {this.props.renderSearchBar()}
      </header>
    );
  }
}

const ColorButton = withStyles({
  root: {
    boxShadow: 'none',
    display: "block",
	  padding: "1em",
    paddingLeft: "0.5em",
    width: `calc(${sw} * 2/3 + 1.5vw)`,
    textAlign: "left",
    fontSize: fs,
    border: "none",
    backgroundColor: bg,
    '&:hover': {
      backgroundColor: hc,
    },
    '&:active': {
      backgroundColor: hc,
    },
  }
})(Button);

class SideMenu extends React.Component {

  onClick() {
    alert("r");
  }

  // TODO: change the onClicks to change the window loaded in the Dashboard Schemeviewer

  render() {
    return (
      <Grid className="SideMenu">
        <h className="SideMenu-h">SCHEMING</h>
        <ColorButton onClick={this.onClick}>My Schemes</ColorButton>
        <ColorButton onClick={this.onClick}>Browse Schemes</ColorButton>
        <ColorButton onClick={this.onClick}>My Univ's Schemes</ColorButton>
        <h className="SideMenu-h">ACCOUNT</h>
        <ColorButton onClick={this.onClick}>Profile</ColorButton>
      </Grid> 
    );
  }
}

class Dashboard extends React.Component {
  /**
   * Header and side panel to display links to various pages / functionality
   * Such as Scheme Creator, My Schemes, Home, Search Schemes, etc.
   * If a link is clicked in the side panel, the page / url will not change,
   * it will just load that specific window into the Dashboard viewer
   */

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
    };

    this.submitQuery = this.submitQuery.bind(this);
    this.displayQuery = this.displayQuery.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
  }

  submitQuery(event) {
    // TODO: search database using this.state.searchQuery
    // enforce order of search as professor, uni, course
    event.preventDefault();
    alert(this.state.searchQuery);

    // clear out input
    this.setState({
      searchQuery: ""
    });
  }

  displayQuery(event) {
    // get input from search bar
    this.setState({
      searchQuery: event.target.value,
    });
  }

  renderSearchBar() {
    return (
      // &nbsp is a non breaking space for a cleaner look
      <form className="App-search" onSubmit={this.submitQuery}>
        <label>
          <input
            type="text"
            placeholder="Search schemes..."
            value={this.state.searchQuery}
            onChange={this.displayQuery}
          />
        </label>&nbsp;
        <input type="submit" value="Submit" />
      </form>
    );
  }

  render() {
      return (
        <div>
          <Header renderSearchBar={this.renderSearchBar} />
          <div className="App-bottom">
            <SideMenu />
            <SchemeViewer header={this.state.window} />
          </div>
        </div>
      );
  }
}

export default Dashboard;
