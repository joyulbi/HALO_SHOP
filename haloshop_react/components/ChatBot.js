import React, { useState } from "react";  
import ChatbotModal from "./ChatbotModal";
  
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatWindow = () => {
    setIsOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        title="챗봇"
        onClick={toggleChatWindow}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          fontSize: '24px',
          cursor: 'pointer',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}
      >
        💬
      </button>

      <ChatbotModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};


export default ChatBot;