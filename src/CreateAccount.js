import React from 'react';
import './CreateAccount.css';
import { Logo, Name } from './globals';
import { Link } from "react-router-dom";

export default class CreateAccount extends React.Component {
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
        if (this.state.password === this.state.confirmPassword) {
            // ******
            // TODO: Create a new user with this.state.username and this.state.password
            // ******
            alert("New account created");
        }
        else {
            alert("Passwords don't match. Please try again.");
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