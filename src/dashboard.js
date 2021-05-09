import logo from './logo.svg';
import './dashboard.css';
import React from 'react';
import MySchemes from './dashwins';

// TODO: a recent schemes thing with label dashboard
// TODO: an account thing at the bottom

class Header extends React.Component {

  renderBrand() {
    const name = "Foxtrot";
    return (
      <div className="App-brand">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {name}
        </p>
      </div>
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

class SideMenu extends React.Component {

  onClick() {
    alert("r");
  }

  render() {
    return (
      <div className="SideMenu">
        <nav>
          <h className="SideMenu-h">SCHEMING</h>
          <button className="SideMenu-nava" onClick={this.onClick}>My Schemes</button>
          <button className="SideMenu-nava" onClick={this.onClick}>Browse Schemes</button>
          <button className="SideMenu-nava" onClick={this.onClick}>My University's Schemes</button>
        </nav> 
        <nav>
          <h className="SideMenu-h">ACCOUNT</h>
          <button className="SideMenu-nava" onClick={this.onClick}>Profile</button>
          <button className="SideMenu-nava" onClick={this.onClick}>Settings</button>
        </nav> 
      </div>
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
            <MySchemes />
          </div>
        </div>
      );
  }
}

export default Dashboard;
