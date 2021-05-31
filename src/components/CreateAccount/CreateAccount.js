import React, { useState } from 'react';
import clsx from 'clsx';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Box, FormControl, InputAdornment, InputLabel, Input, IconButton, Button, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useAlert } from 'react-alert'

import './CreateAccount.css';
import { Logo, Name } from '../../globals';

const hc = getComputedStyle(document.documentElement).getPropertyValue('--highlight-color');

const useStyles = makeStyles((theme) => ({
    credentials: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: '25h',
        color: 'black',
    },
    colorButton: {
        fullWidth: true,
        backgroundColor: fade(hc, 0.15),
        '&:hover': {
            backgroundColor: fade(hc, 0.55),
        }
    },
    box: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
  }));

function CreateAccount(props) {

    const alert = useAlert();
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, changeVisibilityOfPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, changeVisibilityOfConfirmPassword] = useState(false);
    const [university, setUniversity] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (username === "") {
            alert.error("Please enter a username");
        }
        else if (!isAlphaNumeric(username)) {
            alert.error("Username can only contain letters and numbers");
        }
        else if (university === "") {
            alert.error("Please enter a university");
        }
        else if (password === "") {
            alert.error("Please enter a password");
        }
        else if (password !== confirmPassword) {
            alert.error("Passwords don't match");
        }
        else {
            // _id will be automatically created by mongoDB
            const user = {
                username: username,
                password: password,
                university: university,
            };

            const res = await createUser(user);

            switch(res) {
                case "0":
                    alert.success("Account created");
                    // including university makes my university's schemes view simpler
                    props.setUserInfo([username, university]);
                    break;
                case "1":
                    alert.error("Username already taken");
                    break;
                default:
                    alert.error("Unknown error");
            }

        }
    }

    return (
        <div className="create-account-wrapper">
            <div className="create-account-brand">
                <img src={Logo} className="App-logo" alt="logo" />
                <p>{Name}</p>
            </div>
            <form onSubmit={handleSubmit} className={classes.credentials}>
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
                    <InputLabel htmlFor="university">University</InputLabel>
                    <Input
                        id="university"
                        type="text"
                        value={university}
                        onChange={ (e) => setUniversity(e.target.value) }
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
                            <InputAdornment position="end" className={classes.visibility}>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={ (e) => changeVisibilityOfPassword( !showPassword ) }
                                    onMouseDown={ (e) => e.preventDefault() }
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
                    <Input
                        id="confirmpassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={ (e) => setConfirmPassword(e.target.value) }
                        endAdornment={
                            <InputAdornment position="end" className={classes.visibility}>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={ (e) => changeVisibilityOfConfirmPassword( !showConfirmPassword ) }
                                    onMouseDown={ (e) => e.preventDefault() }
                                    edge="end"
                                >
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Box className={clsx(classes.box, classes.margin)}>
                    <Button type='submit' className={classes.colorButton}>Create Account</Button>
                    <Typography variant='overline' align='center'>Or</Typography>
                    <Button className={classes.colorButton} href="/">Return Home</Button>
                </Box>
            </form>
        </div>
    );
}

async function createUser(user) {
    let res = await fetch("http://localhost:3001/users", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
    return res.text(); // 0 if succeeded, 1 if username is already taken
}

// taken from Michael Martin-Smucker's answer at https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript/25352300#25352300
function isAlphaNumeric(str) {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

export default CreateAccount;

