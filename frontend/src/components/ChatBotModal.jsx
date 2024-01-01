import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Button } from "@chatscope/chat-ui-kit-react";
import React from "react";
import ChatBot from "./ChatBot";
import { ChatIcon } from "@chakra-ui/icons";

const ChatBotModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("full");

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

  const sizes = ["full"];

  return (
    <>
      {sizes.map((size) => (
        <Button onClick={() => handleSizeClick(size)} key={size} m={4}>
          <h1 style={{ color: "black", fontWeight: "bold" }}>
            <span>AI</span> Bot <ChatIcon />
          </h1>
        </Button>
      ))}

      <Modal onClose={onClose} size={size} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={"2xl"}
            fontWeight={"bold"}
          >
            <span>AI</span> Bot
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} justifyContent={"center"}>
            <ChatBot />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatBotModal;
