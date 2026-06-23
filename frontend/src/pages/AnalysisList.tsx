import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, TrendingUp, Sparkles, Target, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useAnalysis } from '@/hooks/useAnalysis';
import { formatDate, getScoreColor } from '@/lib/utils';

export const AnalysisList = () => {
  const navigate = useNavigate();
  const { analyses, isLoading } = useAnalysis();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Analysis History
            </h1>
            <p className="text-gray-500 text-lg">
              View all your resume analyses and insights
            </p>
          </div>
          
          {analyses.length > 0 && (
            <Button 
              onClick={() => navigate('/resumes')}
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          )}
        </div>

        {analyses.length > 0 ? (
          <div className="grid gap-6">
            {analyses.map((analysis, idx) => (
              <div key={analysis.id} className="group">
                <Card
                  className="relative border-2 border-gray-100 hover:border-violet-200 rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:scale-[1.01] overflow-hidden"
                  onClick={() => navigate(`/analysis/${analysis.id}`)}
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-indigo-50/0 group-hover:from-violet-50/50 group-hover:to-indigo-50/50 transition-all duration-300"></div>
                  
                  <CardContent className="relative pt-8 pb-8">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left Section */}
                      <div className="flex items-start gap-6 flex-1">
                        {/* Icon */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                              Resume Analysis #{analyses.length - idx}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(analysis.created_at)}</span>
                              </div>
                              <span>•</span>
                              <Badge variant="outline" className="rounded-full">
                                {analysis.analysis_type}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Score Preview */}
                          <div className="flex items-center gap-6">
                            {/* Overall Score */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-indigo-200 rounded-2xl blur-xl opacity-50"></div>
                              <div className="relative bg-white border-2 border-violet-100 rounded-2xl px-6 py-4">
                                <p className="text-xs text-gray-500 mb-1 font-medium">
                                  Overall Score
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                  {analysis.scores.overall_score.toFixed(0)}
                                </p>
                              </div>
                            </div>

                            <div className="h-16 w-px bg-gray-200"></div>

                            {/* Stats Grid */}
                            <div className="flex-1 grid grid-cols-3 gap-6">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <p className="text-xs text-gray-500 font-medium">ATS</p>
                                </div>
                                <p className="text-xl font-bold text-blue-600">
                                  {analysis.scores.ats_score.toFixed(0)}
                                </p>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <p className="text-xs text-gray-500 font-medium">Skills</p>
                                </div>
                                <p className="text-xl font-bold text-green-600">
                                  {analysis.matched_skills.length}
                                </p>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                  <p className="text-xs text-gray-500 font-medium">Tips</p>
                                </div>
                                <p className="text-xl font-bold text-amber-600">
                                  {analysis.suggestions.length}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - View Button */}
                      <div className="flex items-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-violet-200/50 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 border-2 border-violet-200 flex items-center justify-center mx-auto">
                  <FileText className="w-12 h-12 text-violet-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-500">
                  Upload a resume and run an analysis to see insights here
                </p>
              </div>
              
              <Button
                size="lg"
                onClick={() => navigate('/resumes')}
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-2xl shadow-xl shadow-gray-900/10 h-14 px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Upload Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};