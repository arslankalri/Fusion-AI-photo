import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithAI } from '../services/geminiService';
import { Spinner } from './Spinner';

interface ChatWindowProps {
    onPromptSelect: (prompt: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onPromptSelect }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hello! Need help crafting the perfect scene for your photo? Just ask!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await chatWithAI(messages, input);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuggestionClick = (text: string) => {
        // FIX: Replaced `replaceAll` with `replace` and a global regex for broader browser compatibility.
        const suggestion = text.replace(/\*\*/g, '');
        onPromptSelect(suggestion);
    }

    const parseMessage = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(part)}
                        className="font-bold text-indigo-300 bg-indigo-900/50 px-2 py-1 rounded-md hover:bg-indigo-800 transition-colors cursor-pointer block text-left my-1"
                    >
                        "{part.slice(2, -2)}"
                    </button>
                );
            }
            return part;
        });
    };

    return (
        <div className="bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[70vh] max-h-[800px]">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-indigo-400">AI Prompt Assistant</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm lg:max-w-md rounded-lg px-4 py-2 ${
                            msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
                        }`}>
                           <p className="text-sm whitespace-pre-wrap">{parseMessage(msg.text)}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs md:max-w-sm lg:max-w-md rounded-lg px-4 py-2 bg-gray-700 text-gray-200 rounded-bl-none flex items-center">
                            <Spinner />
                            <span className="ml-2 text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for ideas..."
                        className="flex-1 p-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-600" disabled={isLoading || !input.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};
