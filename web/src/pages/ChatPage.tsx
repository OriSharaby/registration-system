import React, { useEffect, useState } from "react";
import {
  startChat,
  sendChatMessage,
  type ChatMessage,
} from "../services/chatApi";
import "../styles/chat.css";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatComposer from "../components/chat/ChatComposer";

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initChat = async () => {
      try {
        setError("");
        setIsStartingChat(true);

        const result = await startChat({
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

    initChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
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

        {error && <div className="chat-error chat-error--chat">{error}</div>}

        {isStartingChat ? (
          <div className="chat-loading">
            <div className="chat-loading__card">
              <h2 className="chat-loading__title">Starting chat...</h2>
              <p className="chat-loading__subtitle">
                Please wait while we connect you to the assistant.
              </p>
            </div>
          </div>
        ) : (
          <>
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