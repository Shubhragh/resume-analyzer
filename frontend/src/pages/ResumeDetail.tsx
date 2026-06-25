import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Sparkles, Star, FileText, Mail, Phone , Zap, TrendingUp, Target } from 'lucide-react';
import { BsLinkedin } from 'react-icons/bs'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '@/api/resume.api';
import { analysisApi } from '@/api/analysis.api';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export const ResumeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: resumeApi.delete,
    onSuccess: () => {
      toast.success('Resume deleted');
      navigate('/resumes');
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: analysisApi.create,
    onSuccess: (data) => {
      setIsAnalyzing(false);
      toast.success('Analysis completed!');
      navigate(`/analysis/${data.id}`);
    },
    onError: () => {
      setIsAnalyzing(false);
      toast.error('Analysis failed');
    },
  });

  const handleAnalyze = () => {
    if (resume) {
      setIsAnalyzing(true);
      analyzeMutation.mutate({
        resume_id: resume.id,
        analysis_type: 'general',
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this resume?')) {
      deleteMutation.mutate(id!);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume not found</h3>
            <p className="text-gray-500">The resume you're looking for doesn't exist</p>
          </div>
          <Button onClick={() => navigate('/resumes')} className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl">
            Back to Resumes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/resumes')}
              className="rounded-xl hover:bg-gray-100 mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {resume.title}
                </h1>
                {resume.is_primary && (
                  <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <span className="text-sm font-medium">Primary</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500">
                Uploaded {formatDate(resume.created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleDelete}
              className="rounded-xl border-gray-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-violet-500/25"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <Card className="border-2 border-violet-100 rounded-2xl overflow-hidden">
            <CardContent className="relative pt-8 pb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-purple-50/30 rounded-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Extracted Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, idx) => (
                    <Badge 
                      key={idx} 
                      className="px-3 py-1 bg-white border-2 border-violet-200 text-violet-700 hover:border-violet-400 hover:bg-violet-50 rounded-xl font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        {resume.contact_info && Object.keys(resume.contact_info).length > 0 && (
          <Card className="border-2 border-blue-100 rounded-2xl overflow-hidden">
            <CardContent className="relative pt-8 pb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resume.contact_info.email && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 mb-1">Email</dt>
                        <dd className="text-sm font-medium text-gray-900">{resume.contact_info.email}</dd>
                      </div>
                    </div>
                  )}
                  {resume.contact_info.phone && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <BsLinkedin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 mb-1">Phone</dt>
                        <dd className="text-sm font-medium text-gray-900">{resume.contact_info.phone}</dd>
                      </div>
                    </div>
                  )}
                  {resume.contact_info.linkedin && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100 md:col-span-2">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <dt className="text-xs font-medium text-gray-500 mb-1">LinkedIn</dt>
                        <dd className="text-sm font-medium text-blue-600 truncate">
                          <a
                            href={resume.contact_info.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {resume.contact_info.linkedin}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Text */}
        {resume.raw_text && (
          <Card className="border-2 border-gray-100 rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-500/25">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Resume Content</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
                {resume.raw_text}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="group relative border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10" onClick={() => navigate('/jobs')}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all"></div>
            <CardContent className="relative pt-12 pb-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Compare with Jobs</h3>
                  <p className="text-sm text-gray-600">Match against job descriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group relative border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10" onClick={() => navigate('/comparison')}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-teal-50/0 group-hover:from-emerald-50 group-hover:to-teal-50 transition-all"></div>
            <CardContent className="relative pt-12 pb-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Run Comparison</h3>
                  <p className="text-sm text-gray-600">Detailed analysis & insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};