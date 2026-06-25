import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Bell, Lock, User, CreditCard, Sparkles, Check, Shield, Save } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          <span className="text-gray-900">Account </span>
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600"></div>
        <CardHeader className="pt-6">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <User className="h-5 w-5 text-white" />
            </div>
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-500">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <Input 
                id="username" 
                defaultValue={user?.username} 
                className="border-gray-200 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user?.email} 
                className="border-gray-200 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
            <Input 
              id="fullName" 
              defaultValue={user?.full_name || ''} 
              className="border-gray-200 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 h-11"
            />
          </div>
          <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10 px-8 h-11">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <CardHeader className="pt-6">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Lock className="h-5 w-5 text-white" />
            </div>
            Security
          </CardTitle>
          <CardDescription className="text-gray-500">
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-700 font-medium">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password" 
              className="border-gray-200 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
            <Input 
              id="newPassword" 
              type="password" 
              className="border-gray-200 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              className="border-gray-200 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 h-11"
            />
          </div>
          <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shadow-lg shadow-gray-900/10 px-8 h-11">
            <Shield className="mr-2 h-4 w-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
        <CardHeader className="pt-6">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Bell className="h-5 w-5 text-white" />
            </div>
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive email updates about your analyses
              </p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer" 
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-100 hover:bg-gray-100/50 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Analysis Completion</p>
              <p className="text-sm text-gray-500">
                Get notified when your resume analysis is complete
              </p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="border-2 border-violet-200 rounded-2xl shadow-lg shadow-violet-500/5 hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden relative">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>
        
        <CardHeader className="pt-6 relative">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            Subscription
          </CardTitle>
          <CardDescription className="text-gray-500">
            {user?.is_premium ? 'You are on the Pro plan' : 'Upgrade to unlock premium features'}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {user?.is_premium ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200">
                <div>
                  <p className="font-semibold text-gray-900">Pro Plan</p>
                  <p className="text-sm text-gray-600">Unlimited analyses & features</p>
                </div>
                <span className="px-4 py-1.5 bg-violet-600 text-white text-sm font-medium rounded-full shadow-lg shadow-violet-500/25">
                  Active
                </span>
              </div>
              <Button variant="outline" className="border-gray-200 rounded-xl hover:bg-gray-50 h-11">
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 rounded-xl border border-violet-100">
                <Sparkles className="h-5 w-5 text-violet-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Upgrade to Pro</p>
                  <p className="text-sm text-gray-600">
                    Unlock unlimited analyses, advanced features, and priority support
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-500/25 px-8 h-11">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro - $9.99/mo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};