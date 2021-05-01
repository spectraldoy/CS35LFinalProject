import logo from './logo.svg';
import './App.css';
import React from 'react';

// TODO: Make this all part of a dashboard class, with search bar and stuff all there
// TODO: a header component, with logo and search bar
// TODO: a lagoon component with all the links to click to browse schemes, etc.
// TODO: a recent schemes thing with label dashboard
// TODO: an account thing at the bottom

class Header extends React.Component {
  renderSearchBar() {
    return (
      <div className="App-search">
        <input placeholder="Search schemes..."></input>
      </div>
    );
  }

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
        {this.renderSearchBar()}
      </header>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
