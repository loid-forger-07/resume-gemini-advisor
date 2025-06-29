
import { Brain, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">ResumeAI</span>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Github className="w-4 h-4" />
          View on GitHub
        </Button>
      </div>
    </header>
  );
};
