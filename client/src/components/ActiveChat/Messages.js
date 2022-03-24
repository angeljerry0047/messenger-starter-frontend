import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  let lastMsgReadIdx = messages
    .slice()
    .reverse()
    .filter((message) => message.senderId === userId);

  const lastMsgReadId = lastMsgReadIdx?.[0]?.id;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            lastMsgReadId={lastMsgReadId}
            msgId={message.id}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            isTyping={message?.isTyping}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
