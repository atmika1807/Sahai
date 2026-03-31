import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../lib/api';
import { Send } from 'lucide-react';
import '../styles/chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there 💚 I'm Sahai, your compassionate companion. How are you feeling today? I'm here to listen without judgment." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      });
      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I had trouble connecting. Please try again in a moment 💚" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="chat-page">
      <div className="page-header">
        <h1 className="page-title">AI Chat</h1>
        <p className="page-subtitle">A safe space to share how you're feeling</p>
      </div>

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'assistant' && <div className="msg-avatar">S</div>}
              <div className="msg-bubble">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg assistant">
              <div className="msg-avatar">S</div>
              <div className="msg-bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Share what's on your mind…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className="chat-send-btn btn-primary"
            onClick={send}
            disabled={!input.trim() || loading}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
