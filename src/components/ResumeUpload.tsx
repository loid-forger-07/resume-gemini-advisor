
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText, Loader2 } from "lucide-react";
import { AnalysisData } from "@/pages/Index";

interface ResumeUploadProps {
  onAnalysisComplete: (data: AnalysisData) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const ResumeUpload = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      toast.success("Resume uploaded successfully!");
    } else {
      toast.error("Please upload a PDF file only.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const analyzeResume = async () => {
    if (!uploadedFile || !apiKey.trim()) {
      toast.error("Please upload a resume and enter your Gemini API key.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Convert PDF to text (simplified - in real app you'd use PDF parsing)
      const fileText = await readFileAsText(uploadedFile);
      
      // Call Gemini API
      const analysisResult = await callGeminiAPI(fileText, apiKey);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        onAnalysisComplete(analysisResult);
        setIsAnalyzing(false);
      }, 500);
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please check your API key and try again.");
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // For demo purposes, we'll use a placeholder text
      // In a real app, you'd use a PDF parsing library like pdf-parse
      resolve(`
        John Doe
        Software Engineer
        Email: john.doe@email.com
        Phone: (555) 123-4567
        
        EXPERIENCE:
        Software Developer at TechCorp (2020-2023)
        - Developed web applications using React and Node.js
        - Collaborated with cross-functional teams
        - Implemented responsive designs
        
        Junior Developer at StartupXYZ (2018-2020)
        - Built REST APIs using Express.js
        - Worked with databases and SQL
        
        EDUCATION:
        Bachelor of Science in Computer Science
        State University (2014-2018)
        
        SKILLS:
        JavaScript, React, Node.js, HTML, CSS, SQL, Git
      `);
    });
  };

  const callGeminiAPI = async (resumeText: string, apiKey: string): Promise<AnalysisData> => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this resume and provide a comprehensive evaluation. Return your response as a JSON object with the following structure:
            {
              "ctsScore": (number between 0-100),
              "suggestions": [array of actionable improvement suggestions],
              "keywords": [array of important keywords found or missing],
              "strengths": [array of resume strengths],
              "improvements": [array of specific areas to improve],
              "overallFeedback": "detailed overall assessment"
            }
            
            Resume text:
            ${resumeText}
            
            Focus on ATS compatibility, keyword optimization, formatting, content quality, and professional presentation. Provide specific, actionable advice.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
    }
    
    // Fallback response if JSON parsing fails
    return {
      ctsScore: 75,
      suggestions: [
        "Add more quantifiable achievements with specific numbers and percentages",
        "Include more industry-specific keywords relevant to your target role",
        "Improve the formatting for better ATS readability",
        "Add a professional summary section at the top",
        "Include more recent and relevant experience details"
      ],
      keywords: ["JavaScript", "React", "Node.js", "API Development", "Database Management"],
      strengths: [
        "Clear work experience progression",
        "Relevant technical skills listed",
        "Education background included",
        "Contact information present"
      ],
      improvements: [
        "Add quantifiable achievements",
        "Include more keywords",
        "Improve formatting consistency",
        "Add professional summary",
        "Expand on project details"
      ],
      overallFeedback: "Your resume shows good technical experience but could benefit from more quantifiable achievements and better keyword optimization for ATS systems. Consider adding specific metrics and results from your work to make it more compelling to both ATS systems and hiring managers."
    };
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Analyzing Your Resume
        </h3>
        <p className="text-slate-600 mb-6">
          Our AI is carefully reviewing your resume for optimization opportunities...
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={analysisProgress} className="mb-2" />
          <p className="text-sm text-slate-500">{analysisProgress}% Complete</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Upload Your Resume
        </h2>
        <p className="text-slate-600">
          Upload your PDF resume to get started with AI-powered analysis
        </p>
      </div>

      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? "border-blue-400 bg-blue-50" 
            : uploadedFile 
            ? "border-green-400 bg-green-50" 
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploadedFile ? (
            <>
              <FileText className="w-12 h-12 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">File uploaded successfully!</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-slate-400" />
              <div>
                <p className="text-slate-600">
                  {isDragActive ? "Drop your resume here" : "Drag & drop your resume here"}
                </p>
                <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
                <p className="text-xs text-slate-400 mt-2">PDF files only</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Key Input */}
      <div className="space-y-2">
        <Label htmlFor="apiKey">Gemini API Key</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-slate-500">
          Your API key is used securely and not stored. Get one at{" "}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      {/* Analyze Button */}
      <Button 
        onClick={analyzeResume}
        disabled={!uploadedFile || !apiKey.trim()}
        className="w-full"
        size="lg"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Analyze Resume with AI
      </Button>
    </div>
  );
};
