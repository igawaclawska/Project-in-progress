import "./ChatBubble.css";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";

const ChatBubble = ({ message }) => {
  const { userLogged } = useContext(AuthContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: "start",
      inline: "center",
      behavior: "smooth",
      alignToTop: false,
    });
  }, [message]);

  return (
    <div className={`message ${message.senderId === userLogged.uid}`}>
      <div
        className={
          message.senderId === userLogged.uid
            ? "right-bubble-wrapper"
            : "left-bubble-wrapper"
        }
      >
        <div
          ref={ref}
          className={
            message.senderId === userLogged.uid ? "right-bubble" : "left-bubble"
          }
        >
          <span className="message-sent">{message.text}</span>
        </div>
      </div>{" "}
    </div>
  );
};

ChatBubble.defaultProps = {
  text: "This is a message sent",
};

export default ChatBubble;