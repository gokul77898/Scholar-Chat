
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2 } from 'lucide-react';

interface PaperUploadAreaProps {
  onSummarize: (text: string, complexity: string, language: string) => Promise<void>;
  isSummarizing: boolean;
}

const PaperUploadArea: FC<PaperUploadAreaProps> = ({ onSummarize, isSummarizing }) => {
  const [paperText, setPaperText] = useState('');
  const [complexity, setComplexity] = useState('simple');
  const [language, setLanguage] = useState('English');

  const handleSubmit = () => {
    if (paperText.trim()) {
      onSummarize(paperText, complexity, language);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Research Paper</CardTitle>
        <CardDescription>
          Paste the content of your research paper below, choose your summarization options, and get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Paste your research paper text here..."
          value={paperText}
          onChange={(e) => setPaperText(e.target.value)}
          rows={15}
          className="min-h-[200px] text-sm p-4 rounded-md shadow-inner bg-secondary/30"
          disabled={isSummarizing}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="complexity">Summary Complexity</Label>
            <Select value={complexity} onValueChange={setComplexity} disabled={isSummarizing}>
              <SelectTrigger id="complexity" className="w-full">
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Summary Language</Label>
            <Select value={language} onValueChange={setLanguage} disabled={isSummarizing}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Mandarin">Mandarin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
