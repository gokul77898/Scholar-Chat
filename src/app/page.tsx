"use client";

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';

import ScholarChatHeader from '@/components/scholar-chat/ScholarChatHeader';
import PaperUploadArea from '@/components/scholar-chat/PaperUploadArea';
import PaperDisplay from '@/components/scholar-chat/PaperDisplay';
import ChatWindow, { type ChatMessage } from '@/components/scholar-chat/ChatWindow';

import { summarizeResearchPaper } from '@/ai/flows/summarize-research-paper';
import { answerQuestionsAboutPaper } from '@/ai/flows/answer-questions-about-paper-flow';

const HomePage: FC = () => {
  const [paperText, setPaperText] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { toast } = useToast();

  const handleSummarize = async (text: string) => {
    setIsSummarizing(true);
    setPaperText(text); 
    setSummaryText(null); // Clear previous summary
    setChatMessages([]); // Clear chat history for new paper
    try {
      const result = await summarizeResearchPaper({
        paperText: text,
        complexity: 'simple', // Or make this configurable
        language: 'English',   // Or make this configurable
      });
      setSummaryText(result.summary);
      toast({
        title: "Summary Generated!",
        description: "The paper has been summarized successfully.",
      });
    } catch (error) {
      console.error("Error summarizing paper:", error);
      toast({
        title: "Summarization Failed",
        description: "Could not summarize the paper. Please try again.",
        variant: "destructive",
      });
      setPaperText(null); // Reset paper text if summarization fails
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!paperText) {
      toast({
        title: "No Paper Loaded",
        description: "Please upload and summarize a paper first.",
        variant: "destructive",
      });
      return;
    }

    const newUserMessage: ChatMessage = { id: Date.now().toString() + '-user', sender: 'user', text: message };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setIsChatting(true);

    try {
      const result = await answerQuestionsAboutPaper({
        paperText: paperText,
        question: message,
      });
      const aiResponse: ChatMessage = { id: Date.now().toString() + '-ai', sender: 'ai', text: result.answer };
      setChatMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting answer:", error);
      const errorResponse: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: 'ai',
        text: "Sorry, I encountered an error trying to answer your question. Please try again.",
      };
      setChatMessages((prev) => [...prev, errorResponse]);
      toast({
        title: "Chat Error",
        description: "Could not get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow w-full max-w-5xl">
        <ScholarChatHeader />
        <div className="space-y-8">
          <PaperUploadArea onSummarize={handleSummarize} isSummarizing={isSummarizing} />
          <PaperDisplay originalText={paperText} summaryText={summaryText} isSummarizing={isSummarizing} />
        </div>
      </div>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetTrigger asChild>
          <Button
            variant="primary"
            size="icon"
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 rounded-full w-16 h-16 shadow-xl hover:scale-105 transition-transform"
            aria-label="Toggle Chat Window"
          >
            <Bot size={32} />
          </Button>
        </SheetTrigger>
        <SheetContent 
            side="right" 
            className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col p-0 border-l shadow-2xl"
            onOpenAutoFocus={(e) => e.preventDefault()} // Prevents auto-focusing first element in sheet
        >
          {isChatOpen && ( // Conditionally render ChatWindow to ensure it re-mounts or updates correctly when paperText changes
            <ChatWindow
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isChatting={isChatting}
              paperText={paperText}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HomePage;
