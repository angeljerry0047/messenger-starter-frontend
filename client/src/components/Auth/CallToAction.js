import React from 'react';
import { Grid, Typography, Button, Box } from '@material-ui/core';
import useStyles from './styles';
import { useHistory } from 'react-router-dom';

const CallToAction = ({ ctaText, buttonText, path }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid container alignItems="center" justifyContent="flex-end">
      <Box mr={3}>
        <Typography color="textSecondary">{ctaText}</Typography>
      </Box>
      <Button
        onClick={() => history.push(`${path}`)}
        size="large"
        className={classes.secondaryBtn}
        variant="text"
        color="primary"
      >
        {buttonText}
      </Button>
    </Grid>
  );
};

export default CallToAction;
