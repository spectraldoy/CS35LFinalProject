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
            university: ""
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
        else if (this.state.password !== this.state.confirmPassword) {
            alert.error("Passwords don't match");
        }
        else if (this.state.university === "") {
            alert.error("Please enter a university");
        }
        else {
            const user = {
                username: this.state.username,
                password: this.state.password,
                university: this.state.university,
                userID: "0000"
            }
            
            let res = await fetch("http://localhost:3001/users", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
            })
            res = await res.text();
            alert.success(res);
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
                <label>
					<p>University</p>
					<input type="text" onChange={e => this.setState({university: e.target.value})}/>
				</label>
				<button type="submit">Submit</button>
			</form>
            <Link to="/login"><h2>Return to Login/Dashboard</h2></Link>
        </div>);
    }
}

export default withAlert()(CreateAccount)