// modified from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import { withAlert } from 'react-alert'
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { FormControl, InputAdornment, InputLabel, Input, IconButton, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import './login.css';
import { Logo, Name } from './globals';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');

// Material-UI code mostly taken from: https://material-ui.com/components/text-fields/
const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: '25ch',
        color: 'black',
    },
    colorButton: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),
        backgroundColor: fade(hc, 0.15),
        '&:hover': {
            backgroundColor: fade(hc, 0.55),
        }
    }
  }));

function Login(props) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, changeVisibilityOfPassword] = useState(false);

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const alert = this.props.alert;

        const res = await loginUser(this.state.username, this.state.password);
        switch (res) {
            case "0":
                this.props.setUser(this.state.username);
                break;
            case "1":
                alert.error('Incorrect password');
                break;
            case "2":
                alert.error('Username not found');
                break;
            default:
                alert.error('Unknown Error');
                break;
        }
    }

    if (sessionStorage.getItem('user')) // already logged in
        return <Redirect to="/homePage"/>;

    
    return (
        <div className="login-wrapper">
			<div className="login-brand">
				<img src={Logo} className="App-logo" alt="logo" />
				<p>{Name}</p>
			</div>
            <form className="login-credentials" onSubmit={handleSubmit}>
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={ (e) => setUsername(e.target.value) }
                    />
                </FormControl>
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={ (e) => setPassword(e.target.value) }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={ (e) => changeVisibilityOfPassword( !showPassword ) }
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Button className={clsx(classes.colorButton, "login-credentials-button")} type='submit'>Next</Button>
            </form>
        </div>
    );
}

async function loginUser(username, password) {
    // check username and password with database
    // 0 = success, 1 = wrong password, 2 = username not found
    let res = await fetch("http://localhost:3001/users?username=" + username + "&password=" + password);
    res = res.text();
    return res;
}

export default withAlert()(Login)

