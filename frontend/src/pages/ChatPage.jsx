import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer";
import { ChatState } from "../context/ChatProvider";
import MyChat from "../components/MyChat";
import ChatBox from "./../components/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box>
        {user && <MyChat />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
