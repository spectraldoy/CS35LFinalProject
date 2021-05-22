// modified from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React from 'react';
import './login.css';
import { Logo, Name } from './globals';
import { Link, Redirect } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async e => {
        e.preventDefault();
        const res = await loginUser(this.state.username, this.state.password);
        switch (res) {
            case "0":
                this.props.setUser(this.state.username);
                break;
            case "1":
                alert('Incorrect password! Please try again.');
                break;
            case "2":
                alert('Username not found. Check your username or consider creating an account.');
                break;
            default:
                alert('Unknown Error');
                break;
        }
    }
    
    render() {
        if (sessionStorage.getItem('user')) // already logged in
            return <Redirect to="/homePage"/>;

        return (
        <div className="login-wrapper">
			<div className="login-brand">
				<img src={Logo} className="App-logo" alt="logo" />
				<p>{Name}</p>
			</div>
			<form onSubmit={this.handleSubmit} className="login-credentials">
				<label>
					<p>Username</p>
					<input type="text" onChange={e => this.setState({username: e.target.value})}/>
				</label>
				<label>
					<p>Password</p>
					<input type="password" onChange={e => this.setState({password: e.target.value})}/>
				</label>
				<button type="submit">Submit</button>
			</form>
            <Link to="/createAccount"><h2>Create a new account</h2></Link>
        </div>);
    }
}

async function loginUser(username, password) {
    // check username and password with database
    let res = await fetch("http://localhost:3001/users?username=" + username + "&password=" + password);
    res = res.text();
    return res;
}