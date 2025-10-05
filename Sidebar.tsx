import { Home, BarChart3, TrendingUp, Users, FileText, Settings, HelpCircle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Trends', icon: TrendingUp, href: '/trends' },
  { name: 'Audiences', icon: Users, href: '/audiences' },
  { name: 'Reports', icon: FileText, href: '/reports' },
  { name: 'Integrations', icon: Layers, href: '/integrations' },
];

const bottomNav = [
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Help & Support', icon: HelpCircle, href: '/help' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border">
      <nav className="flex flex-col h-full p-4">
        <div className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="pt-4 border-t border-sidebar-border space-y-1">
          {bottomNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-primary text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}