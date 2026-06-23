import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, RefreshCw, Sparkles, Target, TrendingUp, Award, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreCard } from '@/components/analysis/ScoreCard';
import { ScoreChart } from '@/components/analysis/ScoreChart';
import { SkillsMatch } from '@/components/analysis/SkillsMatch';
import { Suggestions } from '@/components/analysis/Suggestions';
import { ATSScore } from '@/components/analysis/ATSScore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useQuery } from '@tanstack/react-query';
import { analysisApi } from '@/api/analysis.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysisApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis not found</h3>
            <p className="text-gray-500">The analysis you're looking for doesn't exist</p>
          </div>
          <Button 
            onClick={() => navigate('/resumes')}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl"
          >
            Go to Resumes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Background Effects - FIXED */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 -mx-8 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Resume Analysis
                </h1>
                <p className="text-gray-500 mt-1">
                  Detailed insights and recommendations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button 
                variant="outline"
                className="rounded-xl border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Score - Hero Card */}
        <Card className="border-2 border-violet-100 rounded-3xl overflow-hidden shadow-xl shadow-violet-500/5">
          <CardContent className="relative pt-8 pb-8">
            {/* Subtle background only */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-white to-indigo-50/30 rounded-3xl"></div>
            
            <div className="relative text-center space-y-6">
              {/* Score Display */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full blur-2xl opacity-20"></div>
                <div className="relative">
                  <p className="text-sm font-medium text-gray-600 mb-2">Overall Score</p>
                  <div className="relative inline-flex items-center justify-center">
                    <div className="text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {analysis.scores.overall_score.toFixed(1)}
                    </div>
                    <span className="text-2xl font-semibold text-gray-400 ml-2">/100</span>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-gray-600 font-medium">
                  {analysis.scores.overall_score >= 80
                    ? '🎉 Excellent! Your resume is well-optimized.'
                    : analysis.scores.overall_score >= 60
                    ? '👍 Good! A few improvements will make it great.'
                    : '💪 Needs work, but we have suggestions to help!'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="flex justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                      <span className="text-2xl font-bold text-white">{analysis.strengths.length}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Strengths</p>
                </div>

                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <span className="text-2xl font-bold text-white">{analysis.suggestions.length}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Suggestions</p>
                </div>

                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <span className="text-2xl font-bold text-white">{analysis.matched_skills.length}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Matched Skills</p>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center animate-float">
            <Award className="w-8 h-8 text-violet-500" />
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="sticky top-28 z-30 bg-white/80 backdrop-blur-xl -mx-8 px-8 py-4 border-y border-gray-100">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-gray-100 p-1 rounded-2xl">
              <TabsTrigger 
                value="overview"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="skills"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-medium"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="suggestions"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-medium"
              >
                Suggestions
              </TabsTrigger>
              <TabsTrigger 
                value="ats"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-medium"
              >
                ATS Check
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Score Breakdown */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Score Breakdown</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 rounded-2xl group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {analysis.scores.ats_score.toFixed(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">ATS Compatibility</p>
                    <div className="mt-3 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.scores.ats_score}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-violet-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 rounded-2xl group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-violet-600">
                        {analysis.scores.keyword_match_score.toFixed(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">Keyword Match</p>
                    <div className="mt-3 h-2 bg-violet-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.scores.keyword_match_score}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 rounded-2xl group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">
                        {analysis.scores.skill_match_score.toFixed(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">Skills Match</p>
                    <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.scores.skill_match_score}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 rounded-2xl group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-amber-600">
                        {analysis.scores.experience_match_score.toFixed(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">Experience Match</p>
                    <div className="mt-3 h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.scores.experience_match_score}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 rounded-2xl group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">
                        {analysis.scores.education_match_score.toFixed(0)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">Education Match</p>
                    <div className="mt-3 h-2 bg-indigo-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.scores.education_match_score}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Score Chart */}
            <Card className="border-2 border-gray-100 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreChart scores={analysis.scores} />
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="border-2 border-violet-100 rounded-2xl overflow-hidden">
              <CardContent className="relative pt-8 pb-8">
                {/* Subtle background only */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-indigo-50/30 rounded-2xl"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI Analysis Summary</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {analysis.ai_summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Weaknesses */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-green-100 rounded-2xl overflow-hidden">
                <CardContent className="relative pt-8 pb-8">
                  {/* Subtle background only */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-green-700">Strengths</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysis.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-3 group">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700 leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-100 rounded-2xl overflow-hidden">
                <CardContent className="relative pt-8 pb-8">
                  {/* Subtle background only */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/30 rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-700">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysis.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-start gap-3 group">
                          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700 leading-relaxed">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <SkillsMatch
              matched={analysis.matched_skills}
              missing={analysis.missing_skills}
            />
          </TabsContent>

          <TabsContent value="suggestions">
            <Suggestions suggestions={analysis.suggestions} />
          </TabsContent>

          <TabsContent value="ats">
            <ATSScore
              score={analysis.scores.ats_score}
              issues={[
                'Consider using standard section headings',
                'Avoid using tables or complex formatting',
                'Include relevant keywords from job description',
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};