"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';

interface PaperUploadAreaProps {
  onSummarize: (text: string) => Promise<void>;
  isSummarizing: boolean;
}

const PaperUploadArea: FC<PaperUploadAreaProps> = ({ onSummarize, isSummarizing }) => {
  const [paperText, setPaperText] = useState('');

  const handleSubmit = () => {
    if (paperText.trim()) {
      onSummarize(paperText);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Research Paper</CardTitle>
        <CardDescription>
          Paste the content of your research paper below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your research paper text here..."
          value={paperText}
          onChange={(e) => setPaperText(e.target.value)}
          rows={15}
          className="min-h-[200px] text-sm p-4 rounded-md shadow-inner bg-secondary/30"
          disabled={isSummarizing}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSummarizing || !paperText.trim()}
          className="w-full md:w-auto"
        >
          {isSummarizing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Summarize Paper
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaperUploadArea;
