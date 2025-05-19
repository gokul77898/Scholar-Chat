import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, FileText } from 'lucide-react';

interface PaperDisplayProps {
  originalText: string | null;
  summaryText: string | null;
  isSummarizing: boolean;
}

const PaperDisplay: FC<PaperDisplayProps> = ({ originalText, summaryText, isSummarizing }) => {
  if (isSummarizing) {
    return (
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Original Paper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-20 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!originalText && !summaryText) {
    return (
      <Card className="mt-8 p-8 text-center text-muted-foreground shadow-lg">
        <BookOpen size={48} className="mx-auto mb-4" />
        <p className="text-lg">Your paper summary will appear here once you upload and process a document.</p>
      </Card>
    );
  }
  
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {summaryText && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
               <BookOpen className="mr-2 h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full p-4 rounded-md border bg-secondary/30">
              <pre className="whitespace-pre-wrap text-sm">{summaryText}</pre>
            </ScrollArea>
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
