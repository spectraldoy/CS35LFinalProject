import React from "react";
import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"; // also import Link

import './App.css';
import Dashboard from './components/Dashboard/dashboard';
import calculatorInterface from './components/Calculator/calculatorInterface';
import schemeInterface from './components/SchemeInterface/schemeInterface'
import Login from './components/Login/login'
import CreateAccount from './components/CreateAccount/CreateAccount'

function App() {
  const [userInfo, setUserInfo] = UserState();

  let startPage = "/login";
  if (userInfo[0]) // already logged in
    startPage = "/dashboard#My Schemes?owner=" + userInfo[0];

  let app = (
    <div className="App">
      <BrowserRouter>
        <Switch>
            <Route exact path="/">
              <Redirect to={startPage}/>
            </Route>
            <Route path="/login"><Login setUserInfo={setUserInfo} /></Route>
            <Route path="/dashboard"><Dashboard sess={userInfo} setUserInfo={setUserInfo} /></Route>
            <Route path="/calculatorInterface" component={calculatorInterface} />
            <Route path="/createAccount"><CreateAccount setUserInfo={setUserInfo} /></Route>
            <Route path="/schemeInterface" component={schemeInterface} />
        </Switch>
      </BrowserRouter>
    </div>
  );

  return app;
}

// Custom hook. Essentially, when you submit login info, this will change its state, 
// causing a re-render.
function UserState() {
  const getUserInfo = () => {
    const user = sessionStorage.getItem('user');
    const university = sessionStorage.getItem('university');
    return [user, university];
  };
  
  // newInfo[0] = username, newInfo[1] = university
  const saveUserInfo = newInfo => {
    sessionStorage.setItem('user', newInfo[0]);
    sessionStorage.setItem('university', newInfo[1]);
    setUserInfo(newInfo);
  };

  const [userInfo, setUserInfo] = useState(getUserInfo());

  return [userInfo, saveUserInfo];
}


export default App;
