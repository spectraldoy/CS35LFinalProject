import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"; // also import Link

import './App.css';
import Dashboard from './dashboard';
import calculatorInterface from './calculatorInterface';
import schemeInterface from './schemeInterface'

function HomePage() {
  return (
    <ul className="App-router">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/calculatorInterface">Calculator Interface</Link>
      </li>
      <li>
        <Link to="/schemeInterface">Scheme Interface</Link>
      </li>
    </ul>
  );
}

function App() {
  // TODO: make the home page like a login page or something, which routes to Dashboard after user has logged in
  // TODO: put these links in the header?
  return (
    <div className="App">
      <BrowserRouter className="App-router">
        <Switch>
            <Route exact path="/">{HomePage()}</Route> 
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/calculatorInterface" component={calculatorInterface} />
            <Route path="/schemeInterface" component={schemeInterface} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
