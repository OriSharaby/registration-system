import robotIcon from "../../assets/robot-icon.png";

export default function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="chat-header__brand">
        <img
          src={robotIcon}
          alt="robot icon"
          className="chat-header__robot-icon"
        />
        <div>
          <h1 className="chat-header__title">A.B Deliveries Assistant</h1>
          <p className="chat-header__subtitle">Online now</p>
        </div>
      </div>
    </header>
  );
}