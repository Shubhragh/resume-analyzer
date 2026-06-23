import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useResume } from '@/hooks/useResume';
import { cn } from '@/lib/utils';

export const ResumeUpload = () => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadResume, isUploading } = useResume();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      if (!title) {
        setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
  });

  const handleUpload = () => {
    if (selectedFile && title) {
      uploadResume({ title, file: selectedFile });
      setSelectedFile(null);
      setTitle('');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer Resume 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse (PDF, DOC, DOCX)
                </p>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !title || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};