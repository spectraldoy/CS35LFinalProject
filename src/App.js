import React from "react";
import { useState } from 'react';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom"; // also import Link

import './App.css';
import Dashboard from './dashboard';
import calculatorInterface from './calculatorInterface';
import schemeInterface from './schemeInterface'
import Login from './login'

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
  const [token, setToken] = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }

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

function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    return tokenString;
  };
  
  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  const [token, setToken] = useState(getToken());

  return [token, saveToken];
}


export default App;
