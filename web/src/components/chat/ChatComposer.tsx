import React from "react";

type Props = {
  currentMessage: string;
  isSendingMessage: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ChatComposer({
  currentMessage,
  isSendingMessage,
  onMessageChange,
  onSubmit,
}: Props) {
  return (
    <footer className="chat-footer">
      <form className="chat-footer__form" onSubmit={onSubmit}>
        <input
          className="chat-footer__input"
          type="text"
          value={currentMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type your message..."
        />

        <button
          type="submit"
          className="chat-footer__button"
          disabled={isSendingMessage || !currentMessage.trim()}
        >
          {isSendingMessage ? "Sending..." : "Send"}
        </button>
      </form>
    </footer>
  );
}