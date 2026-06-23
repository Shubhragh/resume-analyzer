import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4">
        <p className="text-sm text-muted-foreground">
          © 2024 Resume Analyzer Pro. All rights reserved.
        </p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by Your Team
        </p>
      </div>
    </footer>
  );
};