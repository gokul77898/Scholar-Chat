
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, FileText, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaperDisplayProps {
  originalText: string | null;
  summaryText: string | null;
  keywords: string[] | null;
  isSummarizing: boolean; // Covers both summary and keyword loading for simplicity now
  isExtractingKeywords: boolean;
}

const PaperDisplay: FC<PaperDisplayProps> = ({ originalText, summaryText, keywords, isSummarizing, isExtractingKeywords }) => {
  const showSkeletons = isSummarizing || isExtractingKeywords;

  if (showSkeletons) {
    return (
      <div className="space-y-6 mt-8">
        {/* AI Summary Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
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
            ) : (
              summaryText && <p className="text-muted-foreground">Summary loaded, awaiting other content...</p> || <p className="text-muted-foreground">Summary will appear here.</p>
            )}
          </CardContent>
        </Card>

        {/* Keywords Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isExtractingKeywords ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
              </div>
            ) : (
               keywords && keywords.length > 0 && <p className="text-muted-foreground">Keywords loaded, awaiting other content...</p> || <p className="text-muted-foreground">Keywords will appear here.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Original Paper Skeleton (less prominent during loading of AI content) */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Original Paper
            </CardTitle>
          </CardHeader>
          <CardContent>
            {originalText ? <p className="text-muted-foreground">Original text loaded.</p> : <Skeleton className="h-20 w-full" />}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!originalText && !summaryText && (!keywords || keywords.length === 0)) {
    return (
      <Card className="mt-8 p-8 text-center text-muted-foreground shadow-lg">
        <BookOpen size={48} className="mx-auto mb-4" />
        <p className="text-lg">Upload a paper to see its summary, keywords, and the original text.</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 mt-8">
      {summaryText && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
               <BookOpen className="mr-2 h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px] w-full p-4 rounded-md border bg-secondary/30">
              <pre className="whitespace-pre-wrap text-sm">{summaryText}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      {keywords && keywords.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1 rounded-full shadow">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
       {keywords && keywords.length === 0 && !isExtractingKeywords && originalText && ( // Show if keyword extraction finished but no keywords
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No keywords were extracted, or the paper was too short.</p>
          </CardContent>
        </Card>
      )}
      {originalText && (
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Original Paper
            </CardTitle>
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
