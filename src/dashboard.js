import logo from './logo.svg';
import './App.css';
import React from 'react';

// TODO: check with team, and a framework component, of which dashboard
//       is a subclass, that is used for the Browse Schemes, and search
//       windows, and so on, with top and left panels floating there
//       being optionally collapsible, except for logo. Maybe only left
//       panel collapsible
// TODO: a lagoon component with all the links to click to browse schemes, etc.
// TODO: a recent schemes thing with label dashboard
// TODO: an account thing at the bottom

class Header extends React.Component {

  renderBrand() {
    const name = "SchemePotato";
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

class Lagoon extends React.Component {
  render() {
    return 3;
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
    };

    this.submitQuery = this.submitQuery.bind(this);
    this.displayQuery = this.displayQuery.bind(this);
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
        <Header renderSearchBar={this.renderSearchBar.bind(this)} />
      );
  }
}

export default Dashboard;
