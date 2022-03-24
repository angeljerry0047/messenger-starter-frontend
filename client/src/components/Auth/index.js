import React from 'react';
import { Grid, Typography, Hidden } from '@material-ui/core';
import useStyles from './styles';
import bubble from '../../assets/images/chat.svg';
import Login from './Login';
import Signup from './Signup';

const Auth = ({ type }) => {
  const classes = useStyles();

  const renderAuth = (type) => {
    switch (type) {
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
      default:
        return <Login />;
    }
  };

  return (
    <Grid container className={classes.root}>
      <Hidden smDown>
        <Grid item xs={false} md={5} className={classes.background}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            className={classes.gradient}
          >
            <img src={bubble} alt="logo" />
            <Grid item>
              <Typography
                variant="h4"
                align="center"
                className={classes.introText}
              >
                Converse with anyone <br /> with any language
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
      <Grid item md={7}>
        {renderAuth(type)}
      </Grid>
    </Grid>
  );
};

export default Auth;
