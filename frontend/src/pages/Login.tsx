import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, ArrowRight, ArrowLeft, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth.types';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const Login = () => {
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="relative">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">ResumePro</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold leading-[1.2] tracking-tight">
              Smart Resume Analysis
              <span className="block text-white/80 mt-2">for Your Dream Job</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Get instant, intelligent feedback on your resume, optimize for ATS systems, and match perfectly with job descriptions.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative space-y-6">
          <div className="h-[1px] bg-white/10"></div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: <Sparkles className="w-5 h-5" />, label: 'Instant Analysis' },
              { icon: <Target className="w-5 h-5" />, label: 'ATS Optimized' },
              { icon: <Zap className="w-5 h-5" />, label: 'Job Matching' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/60">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-sm">
          © 2024 ResumePro. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-50 via-white to-white -z-10"></div>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-violet-50 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ResumePro</span>
            </div>
          </div>

          <Card className="border-2 border-gray-100 shadow-2xl shadow-gray-900/5 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-2 pb-8">
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2 mx-auto w-fit mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-violet-700">Secure Login</span>
              </div>
              <CardTitle className="text-3xl font-bold text-center text-gray-900">Welcome back</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">Username or Email</Label>
                  <Input
                    id="username"
                    {...register('username')}
                    placeholder="Enter your username or email"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Enter your password"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-12 text-base font-semibold rounded-xl bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/10 group"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-medium">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold"
                  onClick={() => (window.location.href = '/register')}
                >
                  Create an account
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-gray-400 mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-violet-600 hover:text-violet-700 font-medium">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-violet-600 hover:text-violet-700 font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};