import React, { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  CssBaseline,
  Button,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { SocketContext } from '../context/socket';
import { AuthContext } from '../context/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'calc(100vh - 64px)',
  },
  appbar: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const history = useHistory();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post('/api/messages', body);
    return data;
  };

  const sendMessage = (data, body) => {
    socket.emit('new-message', {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };

  const postMessage = async (body) => {
    try {
      const data = await saveMessage(body);

      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }

      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewConvo = useCallback(
    (recipientId, message) => {
      const newConversations = conversations.map((convo) => {
        if (convo.otherUser.id === recipientId) {
          const convoCopy = { ...convo };
          convoCopy.messages.push(message);
          convoCopy.latestMessageText = message.text;
          convoCopy.id = message.conversationId;
          return convoCopy;
        }
        return convo;
      });
      setConversations(newConversations);
    },
    [setConversations, conversations]
  );

  const addMessageToConversation = useCallback(
    (data) => {
      // if sender isn't null, that means the message needs to be put in a brand new convo
      const { message, sender = null } = data;
      if (sender !== null) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
        };
        newConvo.latestMessageText = message.text;
        setConversations((prev) => [newConvo, ...prev]);
      }

      const newConversations = conversations.map((convo) => {
        if (convo.id === message.conversationId) {
          const convoCopy = { ...convo };
          convoCopy.messages.push(message);
          convoCopy.latestMessageText = message.text;
          return convoCopy;
        }
        return convo;
      });
      setConversations(newConversations);
    },
    [setConversations, conversations]
  );

  const setActiveChat = (username) => {
    setActiveConversation(username);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const handleTypingIndicator = useCallback(
    (data) => {
      // if sender isn't null, that means the message needs to be put in a brand new convo
      const { user, typing } = data;
      setConversations((prev) =>
        prev.map((convo) => {
          if (convo.otherUser.id === user.id) {
            const convoCopy = { ...convo };
            if (typing) {
              convoCopy.messages.push({ id: Date.now(), isTyping: true });
            } else {
              convoCopy.messages = convoCopy.messages.filter(
                (message) => Boolean(message?.isTyping) === false
              );
            }
            return convoCopy;
          } else {
            return convo;
          }
        })
      );
    },
    [setConversations]
  );

  // Lifecycle

  useEffect(() => {
    // Socket init
    socket.on('add-online-user', addOnlineUser);
    socket.on('remove-offline-user', removeOfflineUser);
    socket.on('new-message', addMessageToConversation);
    socket.on('display', handleTypingIndicator);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('add-online-user', addOnlineUser);
      socket.off('remove-offline-user', removeOfflineUser);
      socket.off('new-message', addMessageToConversation);
      socket.off('display', handleTypingIndicator);
    };
  }, [
    addMessageToConversation,
    addOnlineUser,
    handleTypingIndicator,
    removeOfflineUser,
    socket,
  ]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push('/login');
      else history.push('/register');
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/conversations');
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      updateReadTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation]);

  const updateReadTime = async () => {
    const conversation = conversations
      ? conversations.find(
          (conversation) =>
            conversation.otherUser.username === activeConversation
        )
      : {};
    const payload = {
      recipientId: conversation.otherUser.id,
      conversationId: conversation.id || null,
      readTime: new Date().toISOString(),
    };
    try {
      await axios.put('/api/updateReadTime', payload);
      const { recipientId, conversationId, readTime } = payload;

      const newConversations = conversations.map((convo) => {
        if (convo.id === conversationId) {
          const convoCopy = { ...convo };
          if (convo.user1Id === recipientId) {
            convoCopy.user2ReadTime = readTime;
          } else {
            convoCopy.user1ReadTime = readTime;
          }
          convoCopy.unreadCount = 0;
          return convoCopy;
        }
        return convo;
      });
      setConversations(newConversations);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <>
      <div className={classes.appbar}>
        <AppBar position="relative" color="primary">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Chat Room
            </Typography>
            <Button onClick={handleLogout} variant="outlined" color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
        />
      </Grid>
    </>
  );
};

export default Home;
