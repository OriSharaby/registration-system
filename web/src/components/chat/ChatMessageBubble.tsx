import robotIcon from "../../assets/robot-icon.png";
import type { ChatMessage } from "../../services/chatApi";

type Props = {
  message: ChatMessage;
};

function formatMessageTime(timestamp?: string) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatMessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`chat-message-row ${
        isUser ? "chat-message-row--user" : "chat-message-row--assistant"
      }`}
    >
      {!isUser && (
        <img
          src={robotIcon}
          alt="robot icon"
          className="chat-message__avatar"
        />
      )}

      <div
        className={`chat-message ${
          isUser ? "chat-message--user" : "chat-message--assistant"
        }`}
      >
        <div className="chat-message__content">{message.content}</div>
        <div className="chat-message__time">
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}