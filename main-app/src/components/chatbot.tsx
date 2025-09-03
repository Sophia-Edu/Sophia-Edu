import { useState, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import clientRequests from '../requests/client.request';
import { getAvatar } from '../utils/helperFunction';

interface Message {
    content: string;
    isUser: boolean;
}

interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
}

const suggestions = [
    "How can I track my learning progress?",
    "What courses do you offer?",
    "Tell me about your teaching methodology",
    "How do I get started with my first course?",
    "What are the pricing plans?",
    "Is there a mobile app available?"
];

export function ChatBox({ isOpen, onClose }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            content: "Hello! I'm your AI assistant. How can I help you with your educational technology questions? Here are some suggestions to get started:",
            isUser: false,
        },
    ]);
    const [input, setInput] = useState('');
    const [me, setMe] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const profile = await clientRequests.getMe();
                if (mounted) setMe(profile || null);
            } catch (e) {
                // silent fail; fallback avatar will be used
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleSend = async (message: string = input) => {
        if (!message.trim()) return;

        // Add user message
        const userMessage: Message = {
            content: message,
            isUser: true,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Simulate AI response based on the question
        let aiResponse: Message;

        switch (message.toLowerCase()) {
            case "how can i track my learning progress?":
                aiResponse = {
                    content: "Our platform offers detailed progress tracking through interactive dashboards. You can monitor your course completion, quiz scores, and skill development in real-time. We also provide weekly progress reports and achievement badges to keep you motivated!",
                    isUser: false,
                };
                break;
            case "what courses do you offer?":
                aiResponse = {
                    content: "We offer a wide range of courses across various disciplines including: Programming & Development, Data Science, Business & Management, Design, and Digital Marketing. Each course is crafted by industry experts and includes hands-on projects.",
                    isUser: false,
                };
                break;
            default:
                aiResponse = {
                    content: "Thank you for your question! In a full implementation, I would provide specific information about our edutech platform based on your query. Is there anything specific you'd like to know about our courses or learning features?",
                    isUser: false,
                };
        }

        setTimeout(() => {
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);

        setInput('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
                <h3 className="font-semibold">AI Assistant</h3>
                <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                    const userAvatar = getAvatar(me?.profile_image);
                    const botAvatar = getAvatar("");
                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex items-end gap-2",
                                message.isUser ? "justify-end" : "justify-start"
                            )}
                        >
                            {!message.isUser && (
                                <img
                                    src={botAvatar}
                                    alt="AI avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-lg p-3",
                                    message.isUser
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                                )}
                            >
                                {message.content}
                            </div>
                            {message.isUser && (
                                <img
                                    src={userAvatar}
                                    alt="Your avatar"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                        </div>
                    );
                })}

                {/* Show suggestions only when there's just the initial message */}
                {messages.length === 1 && (
                    <div className="mt-4 space-y-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSend(suggestion)}
                                className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm"
                            >
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                                <span>{suggestion}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleSend()}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}