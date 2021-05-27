import React from "react";
import { useState } from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom"; // also import Link

import './App.css';
import Dashboard from './dashboard';
import calculatorInterface from './calculatorInterface';
import schemeInterface from './schemeInterface'
import Login from './login'
import CreateAccount from './CreateAccount'

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
        <Link to="/schemeInterface">Scheme Creator Interface</Link>
      </li>
      <li>
        <Link to="/createAccount">Create Account</Link>
      </li>
    </ul>
  );
}

function App() {
  const [user, setUser] = UserState();

  let startPage = "/login";
  if (user) // already logged in
    startPage = "/homePage";

  let app = (
    <div className="App">
      <BrowserRouter>
        <Switch>
            <Route exact path="/">
              <Redirect to={startPage}/>
            </Route>
            <Route path="/homePage" component={HomePage} /> 
            <Route path="/login"><Login setUser={setUser} /></Route>
            <Route path="/dashboard"><Dashboard sess={user} setUser={setUser} /></Route>
            <Route path="/calculatorInterface" component={calculatorInterface} />
            <Route path="/createAccount"><CreateAccount setUser={setUser} /></Route>
            <Route path="/schemeInterface" component={schemeInterface} />
        </Switch>
      </BrowserRouter>
    </div>
  );

  // TODO: put these links in the header?
  return app;
}

// Custom hook. Essentially, when you submit login info, this will change its state, 
// causing a re-render.
function UserState() {
  const getUser = () => {
    const user = sessionStorage.getItem('user');
    return user;
  };
  
  const saveUser = username => {
    // got rid of JSON.stringify - messes up Dashboard
    sessionStorage.setItem('user', username);
    setUser(username);
  };

  const [user, setUser] = useState(getUser());

  return [user, saveUser];
}


export default App;
