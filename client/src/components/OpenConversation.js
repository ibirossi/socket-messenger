import React, { useState, useCallback } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

function OpenConversation() {
  const [text, setText] = useState("");
  // Ref for last message: automatically fixes scroll on last message
  //const lastMessageRef = useRef();

  //useCallback will set the ref. Useful when you have a component with a child frequently re-rendering, and you pass a callback to it.
  const setRef = useCallback(node =>{
    if (node){
      node.scrollIntoView({ smooth: true })
    }
    
  }, [])
  const { sendMessage, selectedConversation } = useConversations();

  function handleSend(e) {
    e.preventDefault();

    sendMessage(
      selectedConversation.recipients.map((r) => r.id),
      text
    );
    setText(""); //clears message box after message is sent
  }

  // useEffect doesnt work well in this case.  Changes every time component re-renders (i.e when typying gets new ref to the element). Needs to work when message sent => useCallback()    
  // triggers every time last message changes
  // useEffect(() => {
  //   if (lastMessageRef.current) {
  //     // scrollIntoView() scrolls element's parent container so element on which called is visible.
  //     lastMessageRef.current.scrollIntoView({ smooth: true });
  //   }
  //   // ensure useEffect only changes when message changes, or will trigger everytime.
  // }, [lastMessageRef.current]);

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        {/* remove h-100 from div className: allows to scroll */}
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage =
              selectedConversation.messages.length - 1 === index;
            return (
              <div
                // checking which if last message or not. Null=if not last Msg dont want a ref
                ref={lastMessage ? setRef : null}
                // align message from self to right.
                key={index}
                className={`my-1 d-flex flex-column ${
                  message.fromMe ? "align-self-end" : ""
                }`}
              >
                <div
                  className={`rounded px-2 py-1 ${
                    message.fromMe ? "bg-primary text-white" : "border"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-muted small ${
                    message.fromMe ? "text-right" : ""
                  }`}
                >
                  {message.fromMe ? "You" : message.senderName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Form onSubmit={handleSend}>
        <Form.Group className="m-2">
          <InputGroup>
            {/* allows send button to be attached to input*/}
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "75px", resize: "none" }}
            />
            <InputGroup.Append>
              <Button type="submit">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
}

export default OpenConversation;
