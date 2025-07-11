import React, { useState, useRef, useEffect } from "react";
import { LoadingOutlined, SmileOutlined } from "@ant-design/icons";
import ChatBotMessage from "./ChatBotMessage";

const ChatbotModal = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState("ko");

  const TEXTS = {
    greeting: {
      ko: "안녕하세요! 어떤 도움이 필요하신가요?",
      en: "Hello! How can I assist you today?",
    },
    followUp: {
      ko: "다른 점이 더 궁금하신가요?",
      en: "Would you like to ask anything else?",
    },
    options: {
      ko: [
        { label: "상품", value: "product" },
        { label: "캠페인", value: "campaign" },
        { label: "경매", value: "auction" },
        { label: "환불", value: "refund" },
        { label: "기타", value: "etc" },
      ],
      en: [
        { label: "Product", value: "product" },
        { label: "Campaign", value: "campaign" },
        { label: "Auction", value: "auction" },
        { label: "Refund", value: "refund" },
        { label: "Others", value: "etc" },
      ],
    },
    productOptions: {
      ko: ["입고일", "배송시간", "기타"],
      en: ["Restock", "Shipping Time", "Others"],
    },
  };

  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setMessages([{ message: TEXTS.greeting[language], isBot: true }]);
    setOptions(TEXTS.options[language]);
  }, [language]);

  const handleOptionClick = (option) => {
    const userMessage = { message: option.label, isBot: false };
  setMessages((prev) => [...prev, userMessage]);

    let botResponse = "";
    let nextOptions = [];

    switch (option.value) {
      case "product":
        botResponse =
          language === "ko"
            ? "상품 관련해서 어떤 정보를 원하시나요?"
            : "What information would you like about the product?";
        nextOptions = TEXTS.productOptions[language].map((label, i) => ({
          label,
          value: ["restock", "shipping", "product_etc"][i],
        }));
        break;
      case "campaign":
        botResponse =
          language === "ko"
            ? "캠페인은 일정 기간 동안 진행되는 기부 이벤트입니다!\n고객님께서 적립하신 포인트를 원하는 팀에 기부할 수 있고,\n시즌 종료 후 해당 팀 이름으로 실제 기부가 이루어져요.\n작은 참여가 큰 도움이 된답니다!"
            : "Campaigns are donation events held for a limited time!\nYou can donate your points to your favorite team,\nand at the end of the season, real donations will be made in that team's name.\nYour small participation can make a big difference!";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "auction":
        botResponse =
          language === "ko"
            ? "경매 관련 어떤 정보를 원하시나요?"
            : "What would you like to know about auctions?";
        nextOptions = [
          { label: language === "ko" ? "참여" : "Join", value: "auction_join" },
          { label: language === "ko" ? "결과" : "Result", value: "auction_result" },
          { label: language === "ko" ? "낙찰" : "Winning", value: "auction_win" },
        ];
        break;
      case "auction_join":
        botResponse =
          language === "ko"
            ? "경매는 특정 날짜에 맞춰 열려요!\n해당 일정에 맞춰 홈페이지에서 참여하실 수 있습니다."
            : "Auctions are held on scheduled dates!\nYou can participate via the website during the event.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "auction_result":
        botResponse =
          language === "ko"
            ? "경매 종료 후 낙찰자가 자동으로 확정되며,\n낙찰 취소도 가능해요. 확인은 마이페이지에서 하실 수 있습니다!"
            : "After the auction ends, the winner is automatically determined.\nCancellations are also possible via My Page.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "auction_win":
        botResponse =
          language === "ko"
            ? "낙찰 여부는 마이페이지에서 직접 확인 및 결정할 수 있어요."
            : "You can check and manage your winning status directly in My Page.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "refund":
        botResponse =
          language === "ko"
            ? "환불은 고객센터를 통해 문의해 주세요."
            : "For refunds, please contact our customer service.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "etc":
        botResponse =
          language === "ko"
            ? "기타 문의는 고객센터를 통해 도와드릴 수 있습니다."
            : "For other inquiries, please reach out to customer service.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "restock":
        botResponse =
          language === "ko"
            ? "재고 소진 후 일주일 이내 입고 예정입니다."
            : "Restock is expected within a week after it's sold out.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "shipping":
        botResponse =
          language === "ko"
            ? "15시 이전 결제 시 당일 출고되며,\n이후 결제 시 익일 출고됩니다.\n택배사 사정에 따라 지연될 수 있어요."
            : "Orders placed before 3 PM ship the same day.\nAfter 3 PM, shipping will be the next day.\nDelays may occur depending on the courier.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      case "product_etc":
        botResponse =
          language === "ko"
            ? "자세한 내용은 고객센터에 문의해 주세요."
            : "Please contact customer service for detailed inquiries.";
        nextOptions = [TEXTS.followUp[language], ...TEXTS.options[language]];
        break;
      default:
        botResponse =
          language === "ko"
            ? "죄송해요, 잘 이해하지 못했어요. 다시 선택해 주세요."
            : "Sorry, I didn't understand that. Please try again.";
        nextOptions = TEXTS.options[language];
    }

  setMessages((prev) => [...prev, { isBot: true, loading: true }]);

  // 2. 0.7초 딜레이 후 답변 메시지로 교체
  setTimeout(() => {
    setMessages((prev) => {
      // 가장 마지막 로딩 메시지 제거하고 답변 추가
      const filtered = prev.filter((msg) => !msg.loading);
      return [...filtered, { message: botResponse, isBot: true }];
    });

    // 3. 옵션 세팅
    if (typeof nextOptions[0] === "string") {
      setTimeout(() => {
        setMessages((prev) => [...prev, { message: nextOptions[0], isBot: true }]);
        setOptions(TEXTS.options[language]);
      }, 700);
    } else {
      setOptions(nextOptions);
    }
  }, 700);
};

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "400px",
        height: "620px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9999,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#6366f1",
          color: "#ffffff",
          fontWeight: "600",
          fontSize: "16.5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => setLanguage((prev) => (prev === "ko" ? "en" : "ko"))}
            style={{
              background: "#fff",
              color: "#6366f1",
              borderRadius: "6px",
              border: "none",
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            {language === "ko" ? "EN" : "한"}
          </button>
          HALO 챗봇
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={messagesEndRef}
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          backgroundColor: "#f9fafb",
        }}
      >
      {messages.map((msg, idx) =>
        msg.loading ? (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#6366f1",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            <LoadingOutlined style={{ fontSize: "20px" }} />
            <span>HALO 챗봇이 생각 중입니다...</span>
          </div>
        ) : (
          <ChatBotMessage key={idx} message={msg.message} isBot={msg.isBot} />
        )
      )}
      </div>

      {/* 선택지 영역 */}
      {options.length > 0 && (
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            background: "#ffffff",
          }}
        >
          {options.map((opt, idx) =>
            typeof opt === "string" ? null : (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                style={{
                  flex: "1 1 45%",
                  padding: "0.6rem 0.8rem",
                  background: "#eef2ff",
                  color: "#4338ca",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4338ca";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#eef2ff";
                  e.currentTarget.style.color = "#4338ca";
                }}
              >
                {opt.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotModal;
