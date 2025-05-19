
"use client";

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'; // Removed SheetContent as it's not used here
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizonal, Loader2, User, BotIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, eli5: boolean) => Promise<void>;
  isChatting: boolean;
  paperText: string | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ messages, onSendMessage, isChatting, paperText }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [eli5Mode, setEli5Mode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() && paperText) {
      onSendMessage(inputMessage.trim(), eli5Mode);
      setInputMessage('');
      // Optionally reset ELI5 mode: setEli5Mode(false);
    }
  };

  return (
    <>
      <SheetHeader className="p-6 border-b">
        <SheetTitle className="text-2xl">Chat with Scholar AI</SheetTitle>
        <SheetDescription>
          {paperText 
            ? "Ask questions about the uploaded paper or related scientific terms."
            : "Upload a paper first to enable chat."}
        </SheetDescription>
      </SheetHeader>
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-end space-x-3",
                msg.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><BotIcon className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "p-3 rounded-xl max-w-[70%] shadow-md",
                  msg.sender === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                 <Avatar className="h-8 w-8">
                  <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isChatting && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
             <div className="flex items-end space-x-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><BotIcon className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-xl bg-muted text-muted-foreground shadow-md">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <SheetFooter className="p-4 border-t bg-background space-y-3">
        <div className="flex items-center space-x-2 px-2">
            <Switch
            id="eli5-mode"
            checked={eli5Mode}
            onCheckedChange={setEli5Mode}
            disabled={!paperText || isChatting}
            />
            <Label htmlFor="eli5-mode" className="text-sm text-muted-foreground">
            Explain Like I'm 5
            </Label>
        </div>
        <div className="flex w-full space-x-2 px-2 pb-2">
          <Input
            type="text"
            placeholder={paperText ? "Ask a question..." : "Upload a paper to chat"}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isChatting && paperText && handleSend()}
            disabled={isChatting || !paperText}
            className="flex-1"
          />
          <Button 
            type="submit" 
            onClick={handleSend} 
            disabled={isChatting || !inputMessage.trim() || !paperText}
            variant="default"
            size="icon"
            aria-label="Send message"
          >
            {isChatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
          </Button>
        </div>
      </SheetFooter>
    </>
  );
};

export default ChatWindow;
