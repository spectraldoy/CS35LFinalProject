import React from "react";
import { useState } from 'react';
import { Route, Switch, Link } from "react-router-dom"; // also import Link

import './App.css';
import Dashboard from './dashboard';
import calculatorInterface from './calculatorInterface';
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
    </ul>
  );
}

function App() {
  const [token, setToken] = useToken();

  if(!token) {
    // instead of calling login here, redirect to a login page?
    return <Login setToken={setToken} />;
  }

  const sess = sessionStorage.getItem('token').split(",");  // sess[0] = username, sess[1] = university
  return (
    <Switch className="App">
        <Route exact path="/">{HomePage()}</Route> 
        <Route path="/login"><Login setToken={setToken} /></Route>
        <Route path="/dashboard">{Dashboard(sess)}</Route>
        <Route path="/calculatorInterface" component={calculatorInterface} />
    </Switch>
  );
}

// Custom hook. Essentially, when you submit login info, this will change its state, 
// causing a re-render.
function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    return tokenString;
  };
  
  const saveToken = userToken => {
    sessionStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const [token, setToken] = useState(getToken());

  return [token, saveToken];
}


export default App;
