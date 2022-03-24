const router = require("express").Router();
const { Conversation } = require("../../db/models");

router.put("/", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const senderId = req.user.id;
  const { recipientId, conversationId, readTime } = req.body;

  if (!recipientId || !conversationId || !readTime) return res.sendStatus(400);

  let updateTime = await Conversation.findConversation(senderId, recipientId)
    .then((conversation) => {
      if (!conversation) throw new Error("undable to find a conversation");
      else if (conversation.id !== conversationId) throw new Error("conversation id does not match with the request");

      if (conversation.user1Id === senderId) {
        conversation.update({ user1ReadTime: readTime });
      } else {
        conversation.update({ user2ReadTime: readTime });
      }

      return { success: "Last read time for user has been updated!" };
    })
    .catch((err) => console.log(err));

  if (updateTime.error) res.sendStatus(400);

  res.json(updateTime);
});

module.exports = router;
