import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: '#9CADC8',
    letterSpacing: -0.17,
  },
  notification: {
    height: 20,
    width: 20,
    backgroundColor: '#3F92FF',
    marginRight: 10,
    color: 'white',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: -0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();
  const { otherUser, unreadCount } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {lastMessage?.isTyping ? <i>Typing...</i> : latestMessageText}
        </Typography>
      </Box>
      {unreadCount > 0 && (
        <Typography className={classes.notification}>{unreadCount}</Typography>
      )}
    </Box>
  );
};

export default ChatContent;
