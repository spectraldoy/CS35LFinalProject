// modified from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

import React, { useState } from 'react';
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
    },
    colorButton: {
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
        var res = await loginUser(username, password);
        switch (res) {
            case "0":
                props.setToken(username);
                break;
            case "1":
                // todo: make this a div
                alert('Incorrect password! Please try again.');
                break;
            case "2":
                alert('Username not found. Check your username or consider creating an account.');
                break;
            default:
                alert('Something went wrong. Try again.');
        }
    }
    
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
                        type={'text'}
                        value={username}
                        onChange={ (e) => setUsername(e.target.value) }
                        labelWidth={80}
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
                        labelWidth={70}
                    />
                </FormControl>
                <Button className={clsx(classes.margin, classes.colorButton, "login-credentials-button")} type='submit'>Next</Button>
            </form>
        </div>
    );
}

async function loginUser(username, password) {
    // Use to communicate with db
    // TODO: return 0 on success, 1 if password is incorrect, 2 if username is not found
    var res = await fetch("http://localhost:3001/users?username=" + username + "&password=" + password);
    res = res.text();
    return res;
}

export default Login;
