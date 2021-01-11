import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useConversations } from "../contexts/ConversationsProvider";

function OpenConversation() {
  const [text, setText] = useState("");
  const { sendMessage, selectedConversation } = useConversations();

  function handleSend(e) {
    e.preventDefault();

    sendMessage(
      selectedConversation.recipients.map((r) => r.id),
      text
    )
    setText('') //clears message box after message is sent
  }

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
          <div className="h-100 d-flex flex-column align-items-start justify-content-end px-3">
          {
              selectedConversation.messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end' : ''}`}
                      >
                      <div 
                        className={`rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white' : 'border'}`}>
                        {message.text}
                      </div>
                      <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                        {message.fromMe ? 'You' : message.senderName}
                      </div>
                    </div>
                  )
              })
          }

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
