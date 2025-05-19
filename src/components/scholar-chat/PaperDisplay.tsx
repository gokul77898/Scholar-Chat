
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Tag, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface PaperDisplayProps {
  originalText: string | null;
  summaryText: string | null;
  keywords: string[] | null;
  isSummarizing: boolean;
  isExtractingKeywords: boolean;
}

const PaperDisplay: FC<PaperDisplayProps> = ({ originalText, summaryText, keywords, isSummarizing, isExtractingKeywords }) => {
  const { toast } = useToast();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);

  const handleCopyToClipboard = async (textToCopy: string | null, type: 'summary' | 'keywords' | 'original') => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: 'Copied to Clipboard!',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been copied.`,
      });
      if (type === 'summary') setCopiedSummary(true);
      if (type === 'keywords') setCopiedKeywords(true);
      if (type === 'original') setCopiedOriginal(true);
      setTimeout(() => {
        if (type === 'summary') setCopiedSummary(false);
        if (type === 'keywords') setCopiedKeywords(false);
        if (type === 'original') setCopiedOriginal(false);
      }, 2000);
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard. Please try again or copy manually.',
        variant: 'destructive',
      });
      console.error('Failed to copy: ', err);
    }
  };
  
  // Show initial placeholder if nothing is loaded and not currently processing
  if (!originalText && !summaryText && (!keywords || keywords.length === 0) && !isSummarizing && !isExtractingKeywords) {
    return (
      <Card className="mt-8 p-8 text-center text-muted-foreground shadow-lg">
        <BookOpen size={48} className="mx-auto mb-4" />
        <p className="text-lg">Upload or paste a paper to see its summary, keywords, and the original text.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {/* AI Summary Section */}
      {(summaryText || isSummarizing) && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
            {summaryText && !isSummarizing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyToClipboard(summaryText, 'summary')}
                aria-label="Copy summary"
              >
                {copiedSummary ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isSummarizing ? (
              <>
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </>
            ) : summaryText ? (
              <ScrollArea className="h-[250px] w-full p-4 rounded-md border bg-secondary/30">
                <pre className="whitespace-pre-wrap text-sm">{summaryText}</pre>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">Summary will appear here once processed.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Keywords Section */}
      { (keywords || isExtractingKeywords) && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              Keywords
            </CardTitle>
            {keywords && keywords.length > 0 && !isExtractingKeywords && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyToClipboard(keywords.join(', '), 'keywords')}
                aria-label="Copy keywords"
              >
                {copiedKeywords ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isExtractingKeywords ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
              </div>
            ) : keywords && keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1 rounded-full shadow">
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : keywords && keywords.length === 0 ? (
                 <p className="text-muted-foreground">No distinct keywords were extracted for this paper.</p>
            ) : (
              <p className="text-muted-foreground">Keywords will appear here once processed.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Original Paper Section */}
      {originalText && (
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Original Paper
            </CardTitle>
             <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopyToClipboard(originalText, 'original')}
                aria-label="Copy original text"
              >
                {copiedOriginal ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
          </CardHeader>
          <CardContent>
             <ScrollArea className="h-[300px] w-full p-4 rounded-md border bg-secondary/30">
              <pre className="whitespace-pre-wrap text-sm">{originalText}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaperDisplay;
