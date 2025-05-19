
"use client";

import { useState, type FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

import ScholarChatHeader from '@/components/scholar-chat/ScholarChatHeader';
import PaperUploadArea from '@/components/scholar-chat/PaperUploadArea';
import PaperDisplay from '@/components/scholar-chat/PaperDisplay';
import ChatWindow, { type ChatMessage } from '@/components/scholar-chat/ChatWindow';

import { summarizeResearchPaper } from '@/ai/flows/summarize-research-paper';
import { answerQuestionsAboutPaper } from '@/ai/flows/answer-questions-about-paper-flow';
import { extractKeywords } from '@/ai/flows/extract-keywords-flow';

const HomePage: FC = () => {
  const [paperText, setPaperText] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExtractingKeywords, setIsExtractingKeywords] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { toast } = useToast();

  const handleProcessPaper = async (text: string, complexity: string, language: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Paper content cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setIsSummarizing(true);
    setIsExtractingKeywords(true); 
    setPaperText(text); 
    setSummaryText(null); 
    setKeywords(null);   
    setChatMessages([]); 

    
    try {
      const summaryResult = await summarizeResearchPaper({
        paperText: text,
        complexity: complexity,
        language: language,
      });
      setSummaryText(summaryResult.summary);
      toast({
        title: "Summary Generated!",
        description: "The paper has been summarized successfully.",
      });
    } catch (error) {
      console.error("Error summarizing paper:", error);
      setSummaryText("Failed to generate summary."); 
      toast({
        title: "Summarization Failed",
        description: "Could not summarize the paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }

    
    try {
      const keywordResult = await extractKeywords({ paperText: text });
      setKeywords(keywordResult.keywords);
      if (keywordResult.keywords.length > 0) {
          toast({
          title: "Keywords Extracted!",
          description: "Relevant keywords have been identified.",
          });
      } else {
          toast({
          title: "No Keywords Found",
          description: "Could not extract distinct keywords from this paper.",
          variant: "default" 
          });
      }
    } catch (error) {
      console.error("Error extracting keywords:", error);
      setKeywords([]); 
      toast({
        title: "Keyword Extraction Failed",
        description: "Could not extract keywords from the paper.",
        variant: "destructive",
      });
    } finally {
      setIsExtractingKeywords(false);
    }
  };

  const handleSendMessage = async (message: string, eli5: boolean) => {
    if (!paperText) {
      toast({
        title: "No Paper Loaded",
        description: "Please upload and process a paper first.",
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
        eli5: eli5,
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

  const handleClearAll = () => {
    setPaperText(null);
    setSummaryText(null);
    setKeywords(null);
    setChatMessages([]);
    setIsSummarizing(false);
    setIsExtractingKeywords(false);
    setIsChatting(false);
    setIsChatOpen(false); // Close chat window if open
    toast({
      title: "Cleared",
      description: "All content has been cleared.",
    });
  };
  
  const isLoadingContent = isSummarizing || isExtractingKeywords;

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow w-full max-w-5xl">
        <ScholarChatHeader />
        <div className="space-y-8">
          <PaperUploadArea 
            onSummarize={handleProcessPaper} 
            isSummarizing={isLoadingContent} 
            onClearAll={handleClearAll}
            hasPaper={!!paperText}
          />
          <PaperDisplay 
            originalText={paperText} 
            summaryText={summaryText} 
            keywords={keywords}
            isSummarizing={isSummarizing} 
            isExtractingKeywords={isExtractingKeywords} 
          />
        </div>
      </div>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default" // Changed from "primary" to "default"
            size="icon"
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 rounded-full w-16 h-16 shadow-xl hover:scale-105 transition-transform"
            aria-label="Toggle Chat Window"
            disabled={!paperText || isLoadingContent} 
          >
            <Bot size={32} />
          </Button>
        </SheetTrigger>
        <SheetContent 
            side="right" 
            className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col p-0 border-l shadow-2xl bg-background"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {isChatOpen && ( 
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
