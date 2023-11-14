import { Box, Flex, Spacer } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import MyChat from "../components/MyChat";
import ChatBox from "./../components/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Flex p="10px">
        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChat />}
        </Box>
        <Spacer />
        <Box>{user && <ChatBox />}</Box>
      </Flex>
    </div>
  );
};

export default ChatPage;
