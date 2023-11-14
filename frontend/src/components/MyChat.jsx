import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      minHeight="600px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "24px" }}
        d="flex"
        w="100%"
        // justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <Button
          d="flex"
          fontSize={{ base: "15px", md: "19px", lg: "15px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </Box>
    </Box>
  );
};

export default MyChat;
