import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
} from '@material-ui/core';
import CallToAction from './CallToAction';
import useStyles from './styles';
import { AuthContext } from '../../context/auth';

const Signup = () => {
  const { user, register } = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const confirmPassword = formElements.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: 'Passwords must match' });
      return;
    }
    await register({ username, email, password });
  };

  useEffect(() => {
    if (user && user.id) history.push('/home');
  }, [user, history]);

  return (
    <Grid container direction="column" justifyContent="center">
      <Grid item sx>
        <CallToAction
          ctaText="Already have an account?"
          buttonText="Login"
          path="/login"
        />
      </Grid>
      <Grid item sx className={classes.formContainer}>
        <Typography variant="h4">Create an account.</Typography>
        <form onSubmit={handleRegister} className={classes.form}>
          <FormControl margin="normal">
            <TextField
              aria-label="username"
              label="Username"
              name="username"
              type="text"
              margin="normal"
              required
            />
          </FormControl>
          <FormControl margin="normal">
            <TextField
              label="E-mail address"
              aria-label="e-mail address"
              type="email"
              name="email"
              margin="normal"
              required
            />
          </FormControl>
          <FormControl
            error={!!formErrorMessage.confirmPassword}
            margin="normal"
          >
            <TextField
              aria-label="password"
              label="Password"
              type="password"
              inputProps={{ minLength: 6 }}
              name="password"
              margin="normal"
              required
            />
            <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
          </FormControl>
          <FormControl
            error={!!formErrorMessage.confirmPassword}
            margin="normal"
          >
            <TextField
              label="Confirm Password"
              aria-label="confirm password"
              type="password"
              inputProps={{ minLength: 6 }}
              name="confirmPassword"
              margin="normal"
              required
            />
            <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
          </FormControl>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              className={classes.primaryBtn}
            >
              Create
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default Signup;
