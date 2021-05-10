import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

import './App.css';
import Dashboard from './dashboard';
import calculatorInterface from './calculatorInterface';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ul>
          <li>
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/calculatorInterface">Calculator Interface</Link>
          </li>
        </ul>
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/Dashboard" component={Dashboard} />
            <Route path="/calculatorInterface" component={calculatorInterface} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
