import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom"; // also import Link

import './App.css';
import Dashboard from './dashboard';
import calculatorInterface from './calculatorInterface';

function App() {
  /*
        <ul>
          <li>
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/calculatorInterface">Calculator Interface</Link>
          </li>
        </ul>
   */
  // for now, switch pages by changing the url in the browser
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/calculatorInterface" component={calculatorInterface} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
