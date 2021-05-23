import React from 'react';
import { Logo, Name } from './globals';
import { Link } from "react-router-dom";
import { withAlert } from 'react-alert'

import './CreateAccount.css';

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async e => {
        e.preventDefault();
        alert = this.props.alert;
        if (this.state.username === "") {
            alert.error("Please enter a username.");
        }
        else if (this.state.password === "") {
            alert.error("Please enter a password.");
        }
        else if (this.state.confirmPassword === "") {
            alert.error("Please confirm your password.");
        }
        else if (this.state.password !== this.state.confirmPassword) {
            alert.error("Passwords don't match");
        }
        else {
            // ******
            // TODO: Create a new user with this.state.username and this.state.password
            // ******
            alert.success("New account created");
        }
    }
    
    render() {
        return (
        <div className="create-account-wrapper">
			<div className="create-account-brand">
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
                <label>
					<p>Confirm Password</p>
					<input type="password" onChange={e => this.setState({confirmPassword: e.target.value})}/>
				</label>
				<button type="submit">Submit</button>
			</form>
            <Link to="/login"><h2>Return to Login/Dashboard</h2></Link>
        </div>);
    }
}

export default withAlert()(CreateAccount)