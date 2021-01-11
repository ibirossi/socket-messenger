import React, { useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useContacts } from "./ContactsProvider";

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

  function createConversation(recipients) {
    setConversations((prevConversations) => {
      return [...prevConversations, { recipients, messages: [] }];
    });
  }
  //separate function because called from server when message sent and when user sends message.
  function addMessageToConversation({ recipients, text, sender }) {
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
    });
  }

  function sendMessage(recipients, text) {
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
    const selected = index === selectedConversationIndex; //determine whether conversation is selected or not.
    return { ...conversation, recipients, selected }; //new conversation
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

function arrayEquality(a, b) {
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  return a.every((element, index) => {
    return element === b[index];
  });
}
