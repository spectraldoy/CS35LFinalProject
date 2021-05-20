// modified from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React from 'react';
import './login.css';

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
        var res = await loginUser(this.state.username, this.state.password);
        switch (res) {
            case "0":
                this.props.setToken(this.state.username);
                break;
            case "1":
                alert('Incorrect password! Please try again.');
                break;
            case "2":
                alert('Username not found. Check your username or consider creating an account.');
                break;

        }
    }
    
    render() {
        return (
        <div className="login-wrapper">
        <h1>Put Logo Here</h1>
        <form onSubmit={this.handleSubmit}>
            <label>
            <p>Username</p>
            <input type="text" onChange={e => this.setState({username: e.target.value})}/>
            </label>
            <label>
            <p>Password</p>
            <input type="password" onChange={e => this.setState({password: e.target.value})}/>
            </label>
            <div>
            <button type="submit">Submit</button>
            </div>
        </form>
        </div>);
    }
}

async function loginUser(username, password) {
    // Use to communicate with db
    // TODO: return 0 on success, 1 if password is incorrect, 2 if username is not found
    var res = await fetch("http://localhost:3001/users?username=" + username + "&password=" + password);
    res = res.text();
    return res;
}