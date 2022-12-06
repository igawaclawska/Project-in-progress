import React, { useContext, useEffect, useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, doc, getDocs, getDoc, updateDoc, setDoc } from "firebase/firestore";
import "../styles.css";
import "../buttons.css";
import UserInfo from "../components/UserInfo"
import MailTag from "../components/MailTag"


const MessageModal = ({ show }) => {
  const [foundUser, userFound] = useState(false);
  const [username, setUsername] = useState("");
  const [groupname, setGroupName] = useState("");
  const [usersSelected, setUserSelected] = useState([]);
  const [user, setUser] = useState({})
  const [err, setErr] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { userLogged } = useContext(AuthContext);


  const handleSearch = async () => {
    if (username != "") {
      let caseInsensitiveUsername = username.toLowerCase()
      const filter = query(
        collection(db, "users"),
        where('displayNameLowerCase', '==', caseInsensitiveUsername)
      );
      try {
        const filteredDocs = await getDocs(filter);
        await filteredDocs.forEach((doc) => {
          searchResults.push(doc.data());
          setSearchResults(searchResults);
        });
      } catch (err) {
        setErr(true);
      } finally {
        if (searchResults.length > 0) {
          userFound(true);
        } else {
          userFound(false);
        }
      }
      // console.log("search array:" + JSON.stringify(searchResults) + "length: " + (searchResults.length));
      setUsername("");
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();

  };

  // console.log("selected array:" + JSON.stringify(usersSelected) + "length: " + (usersSelected.length));
  const createChat = async () => {
    const chatsId = userLogged.uid > usersSelected[0].uid ? userLogged.uid + usersSelected[0].uid : usersSelected[0].uid + userLogged.uid
    try {
      const res = await getDoc(doc(db, "chats", chatsId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", chatsId), { messages: [] });
        await updateDoc(doc(db, "userChats", userLogged.uid), {
          [chatsId + ".messageReceiver"]: {
            uid: usersSelected[0].uid,
            displayName: usersSelected[0].displayName,
            email: usersSelected[0].email,
          },
          [chatsId + ".sender"]: {
            name: userLogged.displayName,
          }
        });
        await updateDoc(doc(db, "userChats", usersSelected[0].uid), {
          [chatsId + ".messageReceiver"]: {
            uid: userLogged.uid,
            displayName: userLogged.displayName,
            email: userLogged.email,
          },
          [chatsId + ".sender"]: {
            name: usersSelected[0].displayName,
          }
        });
      }
    } catch (err) { }
    setUserSelected(null);
    userFound(false);
  };

  const createGroup = async () => {
    var user1 = usersSelected[0];
    var user2 = usersSelected[1];

    const chatsId = groupname.replace(/\s/g, '');
    try {
      const res = await getDoc(doc(db, "chats", chatsId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", chatsId), { messages: [] });
        await updateDoc(doc(db, "groupChat", userLogged.uid), {
          [chatsId + ".groupName"]:{
            name: groupname,
          },
          [chatsId + ".messageReceiver1"]: {
            uid: user1.uid,
            displayName: user1.displayName,
            email: user1.email,
          },
          [chatsId + ".messageReceiver2"]: {
            uid: user2.uid,
            displayName: user2.displayName,
            email: user2.email,
          },
          [chatsId + ".groupOwner"]: {
            uid: userLogged.uid
          },
          [chatsId + ".sender"]: {
            name: userLogged.displayName,
          }
        });
        await updateDoc(doc(db, "groupChat", user1.uid), {
          [chatsId + ".groupName"]:{
            name: groupname,
          },
          [chatsId + ".messageReceiver1"]: {
            uid: userLogged.uid,
            displayName: userLogged.displayName,
            email: userLogged.email,
          },
          [chatsId + ".messageReceiver2"]: {
            uid: user2.uid,
            displayName: user2.displayName,
            email: user2.email,
          },
          [chatsId + ".groupOwner"]: {
            uid: userLogged.uid
          },
          [chatsId + ".sender"]: {
            name: user1.displayName,
          }
        });
        await updateDoc(doc(db, "groupChat", usersSelected[1].uid), {
          [chatsId + ".groupName"]:{
            name: groupname,
          },
          [chatsId + ".messageReceiver1"]: {
            uid: userLogged.uid,
            displayName: userLogged.displayName,
            email: userLogged.email,
          },
          [chatsId + ".messageReceiver2"]: {
            uid: user1.uid,
            displayName: user1.displayName,
            email: user1.email,
          },
          [chatsId + ".groupOwner"]: {
            uid: userLogged.uid
          },
          [chatsId + ".sender"]: {
            name: user2.displayName,
          }
        });
      }
    } catch (err) { }
    setUserSelected(null);
    userFound(false);
    setGroupName("");
  };

  const handleChatCreation = async () => {

    if (((usersSelected.length - 1) == 1) && (groupname != "")) { //if there are 2 recievers
      const res = await getDoc(doc(db, "chats", groupname));
      try {
        if(groupname.length < 5){
          alert("Please select group name with at least 5 characters");
        } else if (res.exists()) {
          alert("Please use another group name");
        } else {
          await createGroup();
        }
      } catch (error) {
        
      }
     
    } else if (((usersSelected.length - 1) == 0)) { //if there's just 1
        await createChat();  
    }
    show(false);
  }
  const handleSelect = (u, idx) => {
    setUser(u);
    if (!usersSelected.includes(u)) {
      searchResults.splice(idx, 1); // remove object from the search Array
      usersSelected.push(u); //adding the specific user from the searchResults to the usersSelected 
    }
    setUserSelected(usersSelected);
    console.log("search array after selection:" + JSON.stringify(searchResults) + "length: " + (searchResults.length));
  };

  const handleSelect2 = (u, idx) => {
    setUser({});
    if (!searchResults.includes(u)) {
      usersSelected.splice(idx, 1); // remove object from the selectedUsers Array
    }
    console.log("usersSelected array after selection:" + JSON.stringify(usersSelected) + "length: " + (usersSelected.length));
  };

  return (
    <div onClick={() => show(false)} className="modal-div">
      <div
        onClick={(close) => close.stopPropagation()}
        className="create-message-wrapper"
      >
        <div className="create-message-header">
          <h2>Create new chat</h2>
        </div>
        <div className="create-message-body">
          <h3> Receivers:</h3>
          <div className="add-receivers">
            <InputField className="add-input" placeholder="Receiver's ITU e-mail" onKeyDown={handleKey}
              onChange={(e) => setUsername(e.target.value)} value={username}>
            </InputField>
    
              {(usersSelected != null) ? (
                <span>
                  {usersSelected.map((u, idx) => <MailTag text={u.email} onClick={() => handleSelect2(u, idx)}></MailTag>)}
                </span>
              ) : (null)}
            
              {foundUser ? (
                <ul>
                  {searchResults.map((u, idx) => <UserInfo onClick={() => handleSelect(u, idx)} key={u.uid} displayName={u.displayName} uid={u.uid} value={username} email={u.email} idx={idx} />)}
                </ul>
              ) : (null)}
  
          </div>
        </div>
        {(usersSelected.length > 1) ? <InputField className="add-group-name" placeholder="Goup name" onKeyDown={handleKey}
          onChange={(e) => setGroupName(e.target.value)} value={groupname}>
        </InputField> : <>
        </>}
        <div className="create-message-footer">
          <Button
            className="fluid-btn tertiary"
            onClick={() => show(false)}
            text="Cancel"
            icon=""
          ></Button>
          <Button
            className="fluid-btn primary"
            onClick={() => handleChatCreation()}
            text="Create chat"
            icon=""
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
