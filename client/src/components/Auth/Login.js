import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import useStyles from './styles';
import CallToAction from './CallToAction';
import { AuthContext } from '../../context/auth';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const password = formElements.password.value;

    await login({ username, password });
  };

  useEffect(() => {
    if (user && user.id) history.push('/home');
  }, [user, history]);

  return (
    <Grid container direction="column" justifyContent="center">
      <Grid item>
        <CallToAction
          ctaText="Don't have an account?"
          buttonText="Create account"
          path="/register"
        />
      </Grid>
      <Grid item className={classes.formContainer}>
        <Typography variant="h4">Welcome back!</Typography>
        <form onSubmit={handleLogin} className={classes.form}>
          <FormControl margin="normal" required>
            <TextField
              aria-label="username"
              label="Username"
              name="username"
              type="username"
              margin="normal"
              required
            />
          </FormControl>
          <FormControl margin="normal" required>
            <TextField
              label="Password"
              aria-label="password"
              type="password"
              name="password"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Link href="#" to="#" color="primary">
                      Forgot?
                    </Link>
                  </InputAdornment>
                ),
              }}
              required
            />
          </FormControl>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              className={classes.primaryBtn}
            >
              Login
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
