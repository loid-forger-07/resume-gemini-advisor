
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Tags, 
  RefreshCw,
  Award,
  Lightbulb
} from "lucide-react";
import { AnalysisData } from "@/pages/Index";

interface AnalysisResultsProps {
  data: AnalysisData;
  onNewAnalysis: () => void;
}

export const AnalysisResults = ({ data, onNewAnalysis }: AnalysisResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Analysis Results</h2>
          <p className="text-slate-600 mt-1">Here's what our AI found about your resume</p>
        </div>
        <Button onClick={onNewAnalysis} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* CTS Score Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-8 translate-x-8" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            ATS Compatibility Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 mb-4">
            <div className={`text-4xl font-bold ${getScoreColor(data.ctsScore)}`}>
              {data.ctsScore}
            </div>
            <div className="text-2xl text-slate-400">/100</div>
            <Badge 
              variant="secondary" 
              className={`${getScoreBg(data.ctsScore)} ${getScoreColor(data.ctsScore)} border-0`}
            >
              {data.ctsScore >= 80 ? "Excellence" : data.ctsScore >= 60 ? "Good" : "Needs Work"}
            </Badge>
          </div>
          <Progress value={data.ctsScore} className="mb-4" />
          <p className="text-slate-600 text-sm">
            Your resume's compatibility with Applicant Tracking Systems (ATS)
          </p>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {data.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-purple-600" />
            Important Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {keyword}
              </Badge>
            ))}
          </div>
          <p className="text-slate-600 text-sm mt-3">
            These keywords are important for your industry. Make sure they appear naturally in your resume.
          </p>
        </CardContent>
      </Card>

      {/* Overall Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">{data.overallFeedback}</p>
        </CardContent>
      </Card>
    </div>
  );
};
