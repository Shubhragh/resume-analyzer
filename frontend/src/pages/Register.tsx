import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/types/auth.types';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register = () => {
  const { register: registerUser, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerUser(registerData);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="relative">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">ResumePro</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-bold leading-[1.2] tracking-tight">
              Build the Perfect Resume
              <span className="block text-white/80">Start Free Today</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Get instant feedback, optimize for ATS systems, and match your resume with job descriptions — all in one place.
            </p>
          </div>
        </div>

        <p className="relative text-white/40 text-sm">
          © 2024 ResumePro. All rights reserved.
        </p>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-50 via-white to-white"></div>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-violet-50 rounded-full blur-3xl"></div>
        
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
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-bold text-center text-gray-900">Create an account</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="name@example.com"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                  <Input
                    id="username"
                    {...register('username')}
                    placeholder="johndoe"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-gray-700 font-medium">
                    Full Name
                    <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                  </Label>
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    placeholder="John Doe"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Create a strong password"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="Confirm your password"
                    className="h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400 bg-gray-50/50"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-12 text-base font-semibold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25 group mt-2"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-xs text-center text-gray-400">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-violet-600 hover:text-violet-700 font-medium">
                    Terms
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-violet-600 hover:text-violet-700 font-medium">
                    Privacy Policy
                  </Link>
                </p>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-medium">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-semibold"
                  onClick={() => (window.location.href = '/login')}
                >
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};