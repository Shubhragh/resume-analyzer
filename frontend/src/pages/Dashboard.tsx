import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp, Briefcase, Target, Upload, Plus, Sparkles, Award, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreCard } from '@/components/analysis/ScoreCard';
import { useResume } from '@/hooks/useResume';
import { useAnalysis } from '@/hooks/useAnalysis';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ResumeCard } from '@/components/resume/ResumeCard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { resumes, isLoading: resumesLoading } = useResume();
  const { analyses, isLoading: analysesLoading } = useAnalysis();

  const latestAnalysis = analyses[0];
  const primaryResume = resumes.find((r) => r.is_primary);

  if (resumesLoading || analysesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full animate-pulse"></div>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  const avgScore = analyses.length > 0 
    ? (analyses.reduce((sum, a) => sum + a.scores.overall_score, 0) / analyses.length).toFixed(0)
    : '--';

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="relative space-y-10">
        {/* Welcome Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 rounded-3xl blur-2xl opacity-50"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25 ring-1 ring-white/20">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Welcome back! <span className="inline-block animate-float">👋</span>
                </h1>
                <p className="text-gray-500 text-lg mt-1">
                  Here's an overview of your resume optimization journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative group border-2 border-violet-100 hover:border-violet-300 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Total Resumes</CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">{resumes.length}</div>
              <p className="text-xs text-gray-500 font-medium">
                {primaryResume ? '1 primary resume' : 'No primary resume set'}
              </p>
            </CardContent>
          </Card>

          <Card className="relative group border-2 border-emerald-100 hover:border-emerald-300 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Analyses Done</CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">{analyses.length}</div>
              <p className="text-xs text-gray-500 font-medium">
                {analyses.length > 0 ? 'Keep improving!' : 'Get started'}
              </p>
            </CardContent>
          </Card>

          <Card className="relative group border-2 border-blue-100 hover:border-blue-300 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Saved Jobs</CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs text-gray-500 font-medium">Add jobs to track</p>
            </CardContent>
          </Card>

          <Card className="relative group border-2 border-amber-100 hover:border-amber-300 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Avg Score</CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-gray-900 mb-1">{avgScore}</div>
              <p className="text-xs text-gray-500 font-medium">Out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Analysis */}
        {latestAnalysis && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Latest Analysis</h2>
                <p className="text-sm text-gray-500 mt-1">Your most recent resume evaluation</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/analysis')}
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl font-semibold group"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="group relative border-2 border-violet-100 hover:border-violet-300 rounded-2xl hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full"></div>
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {latestAnalysis.scores.overall_score.toFixed(0)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-3">Overall Score</p>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000"
                      style={{ width: `${latestAnalysis.scores.overall_score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {latestAnalysis.scores.overall_score >= 80 ? 'Excellent performance' : 'Room for improvement'}
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative border-2 border-blue-100 hover:border-blue-300 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full"></div>
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {latestAnalysis.scores.ats_score.toFixed(0)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-3">ATS Score</p>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${latestAnalysis.scores.ats_score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {latestAnalysis.scores.ats_score >= 80 ? 'ATS optimized' : 'Needs optimization'}
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative border-2 border-emerald-100 hover:border-emerald-300 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full"></div>
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {latestAnalysis.scores.skill_match_score.toFixed(0)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-3">Skills Match</p>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000"
                      style={{ width: `${latestAnalysis.scores.skill_match_score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {latestAnalysis.scores.skill_match_score >= 80 ? 'Strong match' : 'Can improve'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500 mt-1">Get started with these essential tools</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card 
              className="group relative border-2 border-dashed border-violet-200 hover:border-violet-400 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10" 
              onClick={() => navigate('/resumes')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative pt-14 pb-14">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/25 group-hover:scale-110 transition-transform ring-1 ring-white/20">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Upload New Resume</h3>
                    <p className="text-sm text-gray-600 max-w-xs">
                      Upload your resume to get instant AI-powered analysis and optimization
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-violet-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group relative border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10" 
              onClick={() => navigate('/jobs')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative pt-14 pb-14">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:scale-110 transition-transform ring-1 ring-white/20">
                      <Plus className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Add Job Description</h3>
                    <p className="text-sm text-gray-600 max-w-xs">
                      Compare your resume with job requirements for perfect alignment
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Add Job</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Resumes */}
        {resumes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Resumes</h2>
                <p className="text-sm text-gray-500 mt-1">Your latest uploaded resumes</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/resumes')}
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl font-semibold group"
              >
                View all
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resumes.slice(0, 3).map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};