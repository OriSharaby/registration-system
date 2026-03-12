import React, { type SyntheticEvent } from "react";

type Props = {
  customerName: string;
  phoneNumber: string;
  error: string;
  isStartingChat: boolean;
  onCustomerNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent) => void;
};

export default function ChatStartForm({
  customerName,
  phoneNumber,
  error,
  isStartingChat,
  onCustomerNameChange,
  onPhoneNumberChange,
  onSubmit,
}: Props) {
  return (
    <div className="chat-start">
      <div className="chat-start__card">
        <h2 className="chat-start__title">Start a chat</h2>
        <p className="chat-start__subtitle">
          Enter a few details and begin your conversation.
        </p>

        <form className="chat-start__form" onSubmit={onSubmit}>
          <div className="chat-start__field">
            <label htmlFor="customerName">Name</label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="chat-start__field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          {error && <div className="chat-error">{error}</div>}

          <button
            type="submit"
            className="chat-start__button"
            disabled={isStartingChat}
          >
            {isStartingChat ? "Starting..." : "Start Chat"}
          </button>
        </form>
      </div>
    </div>
  );
}