import React from "react";
import { SmileOutlined } from "@ant-design/icons";

const ChatBotMessage = ({ message, isBot }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-start",
        marginBottom: "12px",
      }}
    >
      {isBot && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#6366f1",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "8px",
            flexShrink: 0,
          }}
        >
          <SmileOutlined style={{ fontSize: "18px" }} />
        </div>
      )}
      <div
        style={{
          background: isBot ? "#e0e7ff" : "#d1fae5",
          color: "#111827",
          padding: "0.6rem 0.9rem",
          borderRadius: "12px",
          maxWidth: "80%",
          whiteSpace: "pre-wrap",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBotMessage;
