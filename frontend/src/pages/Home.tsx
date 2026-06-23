import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Target, TrendingUp, ArrowRight, Star, Shield, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25 ring-1 ring-white/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>
      ),
      title: 'Instant Resume Insights',
      description: 'Receive detailed, actionable feedback tailored to your resume in seconds, powered by advanced language models trained on recruiter preferences',
      gradient: 'from-violet-50 to-indigo-50',
      border: 'border-violet-200 hover:border-violet-400',
      glow: 'hover:shadow-violet-500/10',
    },
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25 ring-1 ring-white/20">
            <Target className="w-7 h-7 text-white" />
          </div>
        </div>
      ),
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems with confidence',
      gradient: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200 hover:border-emerald-400',
      glow: 'hover:shadow-emerald-500/10',
    },
    {
      icon: (
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-xl shadow-amber-500/25 ring-1 ring-white/20">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>
      ),
      title: 'Job Matching',
      description: 'Compare your resume against job descriptions for perfect alignment',
      gradient: 'from-amber-50 to-orange-50',
      border: 'border-amber-200 hover:border-amber-400',
      glow: 'hover:shadow-amber-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ResumePro</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-50 via-white to-white"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        <div className="container mx-auto px-4 relative">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-violet-700">Instant Resume Analysis</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="text-gray-900">
                  Land Your Dream Job
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  with the Perfect Resume
                </span>
              </h1>
              
              <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                Get smart insights, optimize for ATS systems, and match your resume perfectly with job descriptions. All in one powerful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800 text-lg h-14 px-8 rounded-2xl font-semibold shadow-xl shadow-gray-900/10 group"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-lg h-14 px-8 rounded-2xl"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200/50 to-indigo-200/50 rounded-3xl blur-2xl"></div>
              <Card className="relative bg-white/60 backdrop-blur-xl border-gray-200 rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/5">
                <CardContent className="p-1">
                  {/* Mock Browser Chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-100 rounded-full px-4 py-1 text-xs text-gray-400 font-medium">
                        app.resumepro.com/analysis
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Resume Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Software Engineer Resume</p>
                        <p className="text-sm text-gray-400">Analyzed just now</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-2xl font-bold text-green-600">92</span>
                        <span className="text-sm text-gray-400">/100</span>
                      </div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="space-y-2">
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'ATS Score', value: '85', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                        { label: 'Skills Match', value: '24', color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
                        { label: 'Suggestions', value: '8', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                      ].map((stat, idx) => (
                        <div key={idx} className={`rounded-2xl ${stat.bg} border p-4 text-center`}>
                          <p className={`text-2xl font-bold ${stat.color}`}>
                            {stat.value}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-100"></div>
                      <div className="flex-1 h-2 rounded-full bg-gray-100"></div>
                      <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center animate-float">
                <Zap className="w-8 h-8 text-amber-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center animate-float-delayed">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-gray-900">Powerful Features to </span>
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Help You Succeed
              </span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Everything you need to create the perfect resume and land your dream job
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                className={`group relative bg-white border-2 ${feature.border} hover:shadow-2xl ${feature.glow} transition-all duration-500 hover:scale-[1.02] rounded-3xl overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <CardContent className="relative p-8">
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-violet-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-semibold">Learn more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="text-gray-900">How It </span>
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-lg text-gray-500">Three simple steps to optimize your resume</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { 
                step: '01', 
                title: 'Upload Resume', 
                desc: 'Upload your resume in PDF or DOCX format securely',
                icon: <FileText className="w-6 h-6" />,
                gradient: 'from-violet-500 to-purple-600',
              },
              { 
                step: '02', 
                title: 'Smart Analysis', 
                desc: 'Our system analyzes your resume in seconds with precision',
                icon: <Sparkles className="w-6 h-6" />,
                gradient: 'from-indigo-500 to-blue-600',
              },
              { 
                step: '03', 
                title: 'Get Insights', 
                desc: 'Receive detailed feedback and actionable suggestions',
                icon: <Zap className="w-6 h-6" />,
                gradient: 'from-purple-500 to-violet-600',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Connector Line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full">
                    <div className="h-[2px] bg-gradient-to-r from-gray-200 to-transparent"></div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
                      <span className="text-xs font-bold text-gray-600">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              <span className="text-gray-900">Ready to Land Your </span>
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Dream Job?
              </span>
            </h2>
            <p className="text-lg text-gray-500 mb-10">
              Join thousands of professionals who've transformed their careers with our smart resume platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 text-lg h-16 px-10 rounded-2xl font-semibold shadow-2xl shadow-gray-900/10 group"
                onClick={() => navigate('/register')}
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg h-16 px-10 rounded-2xl"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-6">No credit card required · Free forever plan available</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">ResumePro</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors font-medium">Contact</a>
            </div>
            <p className="text-sm text-gray-400">© 2024 ResumePro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};