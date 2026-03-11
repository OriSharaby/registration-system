import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../services/chatApi";
import ChatMessageBubble from "./ChatMessageBubble";

type Props = {
  messages: ChatMessage[];
};

export default function ChatMessageList({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <ChatMessageBubble
          key={`${message.role}-${index}`}
          message={message}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}