import React from 'react';
import { LinearProgress, Box } from '@material-ui/core';
import '../../assets/css/threeDotLoader.css';

export const TopBarLoader = () => {
  return (
    <>
      <LinearProgress color="primary" />
      <LinearProgress color="primary" />
    </>
  );
};

export const ThreeDotLoader = () => {
  return <Box className="dot-flashing" />;
};
