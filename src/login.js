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
        var token = await loginUser(this.state.username, this.state.password);
        token = "Success!"; // replace this
        this.props.setToken(token);
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
}