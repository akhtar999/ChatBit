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
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  let users = JSON.parse(req.body.users); // take stringify from frontend then parse it to object
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user); // logged in user

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName, // since the name and the key value is same
    },
    {
      new: true, // it gonna update the new name
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400).send("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400).send("Chat not found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400).send("Chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
