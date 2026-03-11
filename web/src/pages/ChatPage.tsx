import React, { useState, type SyntheticEvent } from "react";
import {
  startChat,
  sendChatMessage,
  type ChatMessage,
} from "../services/chatApi";
import "../styles/chat.css";
import ChatHeader from "../components/chat/ChatHeader";
import ChatStartForm from "../components/chat/ChatStartForm";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatComposer from "../components/chat/ChatComposer";

export default function ChatPage() {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState("");

  const handleStartChat = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phoneNumber.trim()) {
      setError("Please enter your name and phone number");
      return;
    }

    setError("");
    setIsStartingChat(true);

    try {
      const result = await startChat({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        channel: "web",
      });

      setConversationId(result.conversationId);
      setMessages(result.messages);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start chat";
      setError(message);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!conversationId || !currentMessage.trim()) return;

    setError("");
    setIsSendingMessage(true);

    try {
      const result = await sendChatMessage({
        conversationId,
        message: currentMessage.trim(),
      });

      setMessages(result.messages);
      setCurrentMessage("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-shell">
        <ChatHeader />

        {!conversationId ? (
          <ChatStartForm
            customerName={customerName}
            phoneNumber={phoneNumber}
            error={error}
            isStartingChat={isStartingChat}
            onCustomerNameChange={setCustomerName}
            onPhoneNumberChange={setPhoneNumber}
            onSubmit={handleStartChat}
          />
        ) : (
          <>
            {error && <div className="chat-error chat-error--chat">{error}</div>}

            <ChatMessageList messages={messages} />

            <ChatComposer
              currentMessage={currentMessage}
              isSendingMessage={isSendingMessage}
              onMessageChange={setCurrentMessage}
              onSubmit={handleSendMessage}
            />
          </>
        )}
      </div>
    </div>
  );
}