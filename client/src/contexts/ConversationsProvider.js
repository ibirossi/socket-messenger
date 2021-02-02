import React, { useContext, useState, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider"

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    []
  );
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts();
  //need to send message to all.  Need to access socket. 
  const socket = useSocket()

  function createConversation(recipients) {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }];
    });
  }
  //separate function because called from server when message sent and when user sends message.
 const addMessageToConversation = useCallback (({ recipients, text, sender }) => {
    setConversations((prevConversations) => {
      //if no conversation exists with recipient, it will be false => can add new conv.
      let madeChange = false;
      const newMessage = { sender, text };
      const newConversations = prevConversations.map((conversation) => {
        if (arrayEquality(conversation.recipients, recipients)) {
          madeChange = true;
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          };
        }

        return conversation;
      });

      if (madeChange) {
        return newConversations;
      } else {
        return [...prevConversations, { recipients, messages: [newMessage] }];
      }
    }); //addMessToConv only depends on setConvs, add as dependency. Only changes with conv
  },[setConversations])

  //need to listen for 'receive-message from server'
  //need to wrap in useEffect to avoid running on each render. 
  useEffect(() => {
    //if no socket do nothing
    if(socket == null) return
    //if socket exists call addMessageToConv => contains recips, sender, text, id 
    socket.on('receive-message', addMessageToConversation)

    //Removes event listener.  Prevents multiples. 
    //addMessToConv runs every render so need to wrap in useCallBack above
    return () => socket.off('receive-message')
  }, [socket, addMessageToConversation])

  function sendMessage(recipients, text) {
    socket.emit('send-message', { recipients, text })
    addMessageToConversation({ recipients, text, sender: id });
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      });
      const name = (contact && contact.name) || recipient;
      return { id: recipient, name };
    });
    const messages = conversation.messages.map(message => {
        const contact = contacts.find((contact) => {
            return contact.id === message.sender;
          });
          const name = (contact && contact.name) || message.sender
          const fromMe = id === message.sender
          return { ...message, senderName: name, fromMe }
    })

    const selected = index === selectedConversationIndex; //determine whether conversation is selected or not.
    return { ...conversation, messages, recipients, selected }; //new conversation
  });

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex], //in order to show selected conversation
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

//not dependent on component, so placed at end. 
function arrayEquality(a, b) {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
}
