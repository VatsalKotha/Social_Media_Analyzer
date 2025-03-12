import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async () => {
    const response = await axios.post('http://localhost:8000/chatbot', { message: userInput });
    setChatHistory([...chatHistory, { user: userInput, bot: response.data.response }]);
    setUserInput('');
  };

  return (
    <div>
      <h2>Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p><strong>You:</strong> {chat.user}</p>
            <p><strong>Bot:</strong> {chat.bot}</p>
          </div>
        ))}
      </div>
      <Form.Control
        type="text"
        placeholder="Ask me anything..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default Chatbot;