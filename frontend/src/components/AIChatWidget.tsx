import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, MessageSquare, Loader2, User } from "lucide-react";
import api from "@/lib/api";

interface Message {
    role: 'user' | 'ai';
    content: string;
}

export const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Hello! I am your AI study assistant. Ask me anything about your subjects!' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const { data } = await api.post('/ai/ask', { question: userMessage });
            setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
        } catch (error) {
            console.error("Error asking AI:", error);
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen ? (
                <Card className="w-80 md:w-96 h-[500px] shadow-2xl glass border-primary/20 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold">StudySync AI</CardTitle>
                                <p className="text-xs text-muted-foreground">Always here to help</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'ai' && (
                                            <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted rounded-tl-none'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                                                <User className="h-3 w-3 text-secondary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex gap-2 justify-start">
                                        <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot className="h-3 w-3 text-white" />
                                        </div>
                                        <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 flex items-center">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    placeholder="Ask a doubt..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1"
                                    disabled={loading}
                                />
                                <Button type="submit" size="icon" disabled={loading || !input.trim()} className="gradient-primary">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-xl gradient-primary hover:scale-110 transition-transform duration-300"
                >
                    <Bot className="h-7 w-7" />
                </Button>
            )}
        </div>
    );
};
