const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  // this route is responsible for creating and fetching one on one chat
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not send with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    // for isChat to exist it have to satisfy both the condition
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // equal yo current user which is logged in
      { users: { $elemMatch: { $eq: userId } } }, //
    ],
  })
    .populate("users", "-password") // except password return me anything from the users array
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    // here we have all final data about our chat
    path: "latestMessage.sender",
    select: "name, email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]); // no other chat can exist with these two user
  } else {
    // we are gonna create a new chat
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData); //chat created

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      ); //that created chat we are gonna send it to our user

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).then((result) =>
      res.send(result)
    );
  } catch (error) {}
});

module.exports = { accessChat, fetchChat };
