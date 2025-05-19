
"use client";

import type { FC } from 'react';
import { useState, useEffect, useRef, useCallback }
from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2, Trash2, UploadCloud, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PaperUploadAreaProps {
  onSummarize: (text: string, complexity: string, language: string) => Promise<void>;
  isSummarizing: boolean;
  onClearAll: () => void;
  hasPaper: boolean; // To know if there's content to clear from the parent's perspective
}

const PaperUploadArea: FC<PaperUploadAreaProps> = ({ onSummarize, isSummarizing, onClearAll, hasPaper }) => {
  const [paperText, setPaperText] = useState('');
  const [complexity, setComplexity] = useState('simple');
  const [language, setLanguage] = useState('English');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!hasPaper) {
      setPaperText('');
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [hasPaper]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setPaperText(text);
          setFileName(file.name);
          toast({
            title: "File Loaded",
            description: `${file.name} has been loaded into the text area.`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a .txt file.",
          variant: "destructive",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      }
    }
  };

  const handleSubmit = () => {
    if (paperText.trim()) {
      onSummarize(paperText, complexity, language);
    } else {
      toast({
        title: "No Content",
        description: "Please paste text or upload a .txt file.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setPaperText('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClearAll(); 
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
       if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setPaperText(text);
          setFileName(file.name);
          toast({
            title: "File Loaded",
            description: `${file.name} has been loaded via drag & drop.`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a .txt file via drag & drop.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Research Paper</CardTitle>
        <CardDescription>
          Paste the content, upload a .txt file, or drag & drop it below. Then choose your summarization options.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          className="p-4 border-2 border-dashed rounded-md hover:border-primary transition-colors cursor-pointer text-center"
          onClick={openFileDialog}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            disabled={isSummarizing}
          />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {fileName ? (
              <span className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2 text-primary" /> {fileName} (Click to change or drag new file)
              </span>
            ) : (
              "Click to browse or drag & drop a .txt file here"
            )}
          </p>
        </div>
        
        <Textarea
          placeholder="Paper content will appear here after upload, or you can paste directly..."
          value={paperText}
          onChange={(e) => {
            setPaperText(e.target.value);
            if (fileName && e.target.value === '') { // If user clears text area after file upload, also clear filename
              setFileName(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            } else if (fileName && e.target.value !== '' && !paperText.startsWith(e.target.value)) {
                // If user starts editing significantly, consider it manual input
                // This logic can be refined, for now, just allow editing.
            }
          }}
          rows={10} // Reduced rows as file upload is primary
          className="min-h-[150px] text-sm p-4 rounded-md shadow-inner bg-secondary/30"
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
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSummarizing || !paperText.trim()}
          className="w-full sm:w-auto"
        >
          {isSummarizing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Summarize & Extract Keywords
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isSummarizing || (!hasPaper && !paperText.trim() && !fileName)}
          className="w-full sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaperUploadArea;
