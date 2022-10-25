import PropTypes from 'prop-types';

const RightChatBubble = ({ onClick, text }) => {
	return (
	<div className="bubble-wrapper">
        <div className="right-bubble">
            <span className="messageSent"> {text}</span>
        </div>
    </div>
  );
}

RightChatBubble.defaultProps = {
	text: 'This is a message sent',
};

export default RightChatBubble;