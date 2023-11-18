import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
// import { ChatState } from "./../context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  // const { user } = ChatState();
  return (
    <Box
      display={"flex"}
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={2}
      py={1}
      mb={1}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text style={{ textTransform: "capitalize" }}>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
