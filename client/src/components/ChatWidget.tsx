import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import './ChatWidget.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; snippet: string }>;
  confidence?: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface ChatWidgetProps {
  apiBaseUrl: string;
  getAuthToken: () => Promise<string>;
}

export default function ChatWidget({ apiBaseUrl, getAuthToken }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    "What's my portfolio performance?",
    "How should I diversify my investments?",
    "What are the current market trends?",
    "How can I minimize risk?",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${apiBaseUrl}/api/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text, useRAG: true }),
      });

      const result = await response.json();

      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.data.answer,
          sources: result.data.sources,
          confidence: result.data.confidence,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(result.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
          <span className="chat-button-badge">AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-header-icon">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3>Investment Assistant</h3>
                <p>Powered by Gemini AI</p>
              </div>
            </div>
            <div className="chat-header-actions">
              <button onClick={toggleMinimize} className="chat-action-btn">
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="chat-action-btn">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="chat-welcome">
                    <MessageCircle size={48} />
                    <h4>Welcome to AI Investment Assistant</h4>
                    <p>Ask me anything about investments, portfolio management, or market trends.</p>
                    
                    <div className="chat-suggestions">
                      <p className="suggestions-label">Try asking:</p>
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div key={message.id} className={`chat-message ${message.role}`}>
                        <div className="message-content">
                          <p>{message.content}</p>
                        </div>
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="chat-message assistant typing">
                        <div className="message-content">
                          <Loader2 className="spinner" size={20} />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form className="chat-input-form" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about investments..."
                  disabled={isLoading}
                  className="chat-input"
                />
                <button type="submit" disabled={!input.trim() || isLoading} className="chat-send-btn">
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
