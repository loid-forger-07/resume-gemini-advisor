
import { useState } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Target } from "lucide-react";

export interface AnalysisData {
  ctsScore: number;
  suggestions: string[];
  keywords: string[];
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
}

const Index = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
            Resume AI Advisor
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Upload your resume and get AI-powered insights to boost your ATS compatibility 
            and land more interviews
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <FileText className="w-4 h-4" />
              PDF Upload
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
              <Target className="w-4 h-4" />
              ATS Optimization
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!analysisData ? (
            <Card className="p-8">
              <ResumeUpload 
                onAnalysisComplete={setAnalysisData}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </Card>
          ) : (
            <AnalysisResults 
              data={analysisData} 
              onNewAnalysis={() => setAnalysisData(null)}
            />
          )}
        </div>

        {/* Features Section */}
        {!analysisData && (
          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">Easy Upload</h3>
              <p className="text-slate-600 text-sm">
                Simply drag and drop your PDF resume or click to browse
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">AI Analysis</h3>
              <p className="text-slate-600 text-sm">
                Powered by Gemini AI for comprehensive resume evaluation
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">ATS Score</h3>
              <p className="text-slate-600 text-sm">
                Get a compatibility score and actionable improvement tips
              </p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
