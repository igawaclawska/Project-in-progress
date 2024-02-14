import "./Home.css";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "../containers/Navbar";
import ThreadsBar from "../containers/ThreadsBar";
import ChatArea from "../containers/ChatArea";

export const Home = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // updates the width variable value in real time
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isThreadsBarVisible, setIsThreadsBarVisible] = useState(true);

  // toggles visibility between <ChatArea> and <ThreadsBar> components, is called only when the screen withh is <= 576px
  // is passed as a second onclick function to the <SingleThread> as a visibility prop
  const toggleMobileViews = () => {
    setIsThreadsBarVisible((current) => !current);
  };

  const renderHomePage = () => {
    let desktopLayout = (
      <>
        <ThreadsBar />
        <ChatArea />
      </>
    );

    let mobileThreadsScreen = <ThreadsBar visibility={toggleMobileViews} />;
    let mobileChatScreen = <ChatArea visibility={toggleMobileViews} />;

    //allows to toggle visibility between the ThreadsBar and the ChatArea
    let mobileLayout = isThreadsBarVisible
      ? mobileThreadsScreen
      : mobileChatScreen;

    return windowWidth <= 576 ? mobileLayout : desktopLayout;
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-body">{renderHomePage()}</div>
    </div>
  );
};
export default Home;
