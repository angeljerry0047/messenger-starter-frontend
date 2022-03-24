import React, { useEffect, useState, useContext } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import { SnackbarError, Home, Auth, TopBarLoader } from './components';
import { SocketContext, socket } from './context/socket';
import { AuthContext } from './context/auth';

const Routes = (props) => {
  const { user } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    if (user?.error) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof user.error === 'string') {
        setErrorMessage(user.error);
      } else {
        setErrorMessage('Internal Server Error. Please try again');
      }
      setSnackBarOpen(true);
    }
  }, [user?.error]);

  if (user?.isFetching) {
    return <TopBarLoader />;
  }

  return (
    <SocketContext.Provider value={socket}>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route path="/login" render={() => <Auth type={'login'} />} />
        <Route path="/register" render={() => <Auth type={'signup'} />} />
        <Route
          exact
          path="/"
          render={(props) => (user?.id ? <Home /> : <Auth type={'signup'} />)}
        />
        <Route path="/home" render={() => <Home />} />
      </Switch>
    </SocketContext.Provider>
  );
};

export default withRouter(Routes);
