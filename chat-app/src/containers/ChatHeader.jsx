import React from 'react';
import TertiaryButton from '../components/TertiaryButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import '../styles.css'

const ChatHeader = ({ onLoad, onClick }) => {
    
    return (
        <header className="chat-header">
            <div className="chat-header-wrapper">
                <div onClick={onClick} className="backBtn"><TertiaryButton className="fixed-btn tertiary with-icon" text='' icon={<ArrowBackIosIcon/>}></TertiaryButton>                </div>
                <span className="chat-header-title">Name Secondname</span>
            </div>
        </header>
    );
}

export default ChatHeader;