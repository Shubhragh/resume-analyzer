import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Briefcase,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'My Resumes', path: '/resumes' },
  { icon: BarChart3, label: 'Analysis', path: '/analysis' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Sparkles, label: 'Comparison', path: '/comparison' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-primary to-blue-600 p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Resume Pro</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="rounded-lg bg-gradient-to-br from-primary/10 to-blue-600/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Upgrade to Pro</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Get unlimited analyses and advanced features
              </p>
              <Button size="sm" className="w-full">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};