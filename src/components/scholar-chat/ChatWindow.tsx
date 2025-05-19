
"use client";

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Brain, Loader2 } from 'lucide-react';
import { SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, eli5: boolean) => Promise<void>;
  isChatting: boolean;
  paperText: string | null; 
}

const ChatWindow: FC<ChatWindowProps> = ({ messages, onSendMessage, isChatting, paperText }) => {
  const [inputValue, setInputValue] = useState('');
  const [eli5, setEli5] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleSend = () => {
    if (inputValue.trim() && paperText) {
      onSendMessage(inputValue, eli5);
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <SheetHeader className="p-4 border-b">
        <SheetTitle className="text-xl font-semibold flex items-center">
          <Brain className="mr-2 h-6 w-6 text-primary" /> Chat About This Paper
        </SheetTitle>
        <SheetDescription className="text-sm text-muted-foreground">
          Ask questions and get AI-powered answers based on the paper's content.
        </SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-grow p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3",
                msg.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === 'ai' && (
                <Avatar className="h-8 w-8 border border-primary/50">
                  <AvatarImage src="https://placehold.co/40x40.png?text=AI" alt="AI Avatar" data-ai-hint="robot face" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[70%] p-3 rounded-xl shadow-md text-sm",
                  msg.sender === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
              {msg.sender === 'user' && (
                 <Avatar className="h-8 w-8 border">
                  <AvatarImage src="https://placehold.co/40x40.png?text=U" alt="User Avatar" data-ai-hint="person outline" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isChatting && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar className="h-8 w-8 border border-primary/50">
                  <AvatarImage src="https://placehold.co/40x40.png?text=AI" alt="AI Avatar" data-ai-hint="robot face" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              <div className="max-w-[70%] p-3 rounded-xl shadow-md bg-secondary text-secondary-foreground">
                <div className="flex items-center space-x-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
            <Switch 
                id="eli5-mode" 
                checked={eli5} 
                onCheckedChange={setEli5}
                disabled={isChatting}
            />
            <Label htmlFor="eli5-mode" className="text-sm text-muted-foreground">
                Explain Like I'm 5 (ELI5) Mode
            </Label>
        </div>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder={paperText ? "Ask a question..." : "Upload a paper to chat"}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow bg-background focus-visible:ring-primary"
            disabled={isChatting || !paperText}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={isChatting || !inputValue.trim() || !paperText}
            aria-label="Send message"
          >
            {isChatting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
