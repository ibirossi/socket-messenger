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
      <div className="flex-grow-1 overflow-auto"></div>
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
