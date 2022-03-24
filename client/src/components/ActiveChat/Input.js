import React, { useState, useContext, useEffect } from 'react';
import {
  FormControl,
  FilledInput,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SocketContext } from '../../context/socket';
import FileIcon from '../../assets/images/fileIcon';
import SmileIcon from '../../assets/images/smileIcon';

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: 'flex-end',
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: '#F4F6FA',
    borderRadius: 8,
    marginBottom: 20,
  },
}));

const Input = ({ otherUser, conversationId, user, postMessage }) => {
  const classes = useStyles();
  const socket = useContext(SocketContext);
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (text.length > 1) return;
    socket.emit('typing', {
      user,
      typing: text.length !== 0,
    });
  }, [socket, user, text]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: formElements.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
    };
    await postMessage(reqBody);
    setText('');
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton>
                <SmileIcon />
              </IconButton>
              <IconButton>
                <FileIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  );
};

export default Input;
