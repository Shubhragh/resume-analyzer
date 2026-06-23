import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, FileText, Briefcase, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useResume } from '@/hooks/useResume';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs.api';
import { analysisApi } from '@/api/analysis.api';
import { toast } from 'sonner';

export const Comparison = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');

  const [selectedResumeId, setSelectedResumeId] = useState('');
  const { resumes, isLoading: resumesLoading } = useResume();
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.getAll(),
  });

  const [selectedJobId, setSelectedJobId] = useState(jobId || '');

  const analyzeMutation = useMutation({
    mutationFn: analysisApi.create,
    onSuccess: (data) => {
      toast.success('Analysis completed!');
      navigate(`/analysis/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Analysis failed');
    },
  });

  const handleAnalyze = () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }
    if (!selectedJobId) {
      toast.error('Please select a job');
      return;
    }

    analyzeMutation.mutate({
      resume_id: selectedResumeId,
      job_id: selectedJobId,
      analysis_type: 'job-specific',
    });
  };

  if (resumesLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
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

      <div className="relative space-y-8 max-w-6xl mx-auto">
        {/* Header */}
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Resume vs Job Comparison
            </h1>
            <p className="text-gray-500 text-lg">
              Analyze how well your resume matches a specific job
            </p>
          </div>
        </div>

        {/* Selection Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Select Resume */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Resume</h2>
                <p className="text-sm text-gray-500">Choose your resume to analyze</p>
              </div>
            </div>

            {resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <Card
                    key={resume.id}
                    onClick={() => setSelectedResumeId(resume.id)}
                    className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                      selectedResumeId === resume.id
                        ? 'border-2 border-violet-500 shadow-xl shadow-violet-500/20 scale-[1.02]'
                        : 'border-2 border-gray-200 hover:border-violet-300 hover:shadow-lg'
                    }`}
                  >
                    {/* Selected Indicator */}
                    {selectedResumeId === resume.id && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-violet-500 to-purple-600 flex items-center justify-center rounded-bl-2xl">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                    
                    {/* REMOVED the overlay that was causing the issue */}
                    
                    <CardContent className="relative p-6">
                      <div className={`absolute inset-0 rounded-2xl ${
                        selectedResumeId === resume.id 
                          ? 'bg-gradient-to-br from-violet-50/50 to-purple-50/50' 
                          : ''
                      }`}></div>
                      <div className="relative flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          selectedResumeId === resume.id
                            ? 'bg-white shadow-lg'
                            : 'bg-gray-100'
                        }`}>
                          <FileText className={`w-6 h-6 ${
                            selectedResumeId === resume.id ? 'text-violet-600' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{resume.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{resume.skills?.length || 0} skills</span>
                            {resume.is_primary && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                  <Sparkles className="w-3 h-3" />
                                  Primary
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No resumes available</p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/resumes')}
                    className="rounded-xl"
                  >
                    Upload a resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Select Job */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Job</h2>
                <p className="text-sm text-gray-500">Choose a job to compare against</p>
              </div>
            </div>

            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`relative cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden ${
                      selectedJobId === job.id
                        ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]'
                        : 'border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    {/* Selected Indicator */}
                    {selectedJobId === job.id && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500 to-indigo-600 flex items-center justify-center rounded-bl-2xl">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    )}
                    
                    <CardContent className="relative p-6">
                      <div className={`absolute inset-0 rounded-2xl ${
                        selectedJobId === job.id 
                          ? 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50' 
                          : ''
                      }`}></div>
                      <div className="relative flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          selectedJobId === job.id
                            ? 'bg-white shadow-lg'
                            : 'bg-gray-100'
                        }`}>
                          <Briefcase className={`w-6 h-6 ${
                            selectedJobId === job.id ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{job.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{job.company_name}</p>
                          <p className="text-xs text-gray-500">
                            {job.required_skills?.length || 0} required skills
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No jobs available</p>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/jobs')}
                    className="rounded-xl"
                  >
                    Add a job
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Analyze Button */}
        <Card className="border-2 border-violet-100 rounded-3xl overflow-hidden shadow-xl">
          <CardContent className="relative pt-12 pb-12">
            {/* Subtle background only */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-indigo-50/30 rounded-3xl"></div>
            
            <div className="relative text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full blur-2xl opacity-20"></div>
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/25">
                  <Zap className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Compare?</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Get AI-powered insights on how well your resume matches the job requirements
                </p>
              </div>
              
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!selectedResumeId || !selectedJobId || analyzeMutation.isPending}
                className="bg-gray-900 text-white hover:bg-gray-800 text-lg h-16 px-10 rounded-2xl font-semibold shadow-2xl shadow-gray-900/10 disabled:opacity-50"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Analyze Match
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-2 border-blue-100 rounded-2xl overflow-hidden">
          <CardContent className="relative pt-8 pb-8">
            {/* Subtle background only */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
            
            <div className="relative flex gap-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-3 text-lg">What you'll get:</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Overall match percentage score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Skill gap analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Keyword optimization suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    ATS compatibility check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Personalized improvement recommendations
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};