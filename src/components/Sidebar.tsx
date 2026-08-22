import React from 'react';
import { ActiveTab } from '../types';
import { 
  Activity, 
  BarChart3, 
  History, 
  ShieldCheck, 
  Settings, 
  User, 
  Server,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedVmName?: string;
  clusterStatus?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedVmName,
}) => {
  const navItems = [
    {
      id: 'analyzer' as ActiveTab,
      label: 'Analyzer',
      icon: Activity,
      badge: 'Core',
    },
    {
      id: 'historical-trends' as ActiveTab,
      label: 'Historical Trends',
      icon: History,
      badge: '24h',
    },
    {
      id: 'best-practices' as ActiveTab,
      label: 'Best Practices',
      icon: ShieldCheck,
      badge: 'KB',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#080808] z-50 flex flex-col border-r border-white/10 shadow-2xl select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/20 flex items-center justify-center text-white">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-light text-sm text-white tracking-[0.25em] uppercase font-sans">
              CPU Analyzer
            </span>
          </div>
          <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
            vSphere 8.0 U2
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[9px] font-light text-white/30 uppercase tracking-[0.3em] font-mono">
          Diagnostics & Sizing
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm transition-all text-left text-xs tracking-wider uppercase font-medium ${
                isActive
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-white/40'
                  }`}
                />
                <span className="tracking-widest">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono tracking-widest ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/[0.04] text-white/40 border border-white/5'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Selected VM Quick Card */}
        {selectedVmName && (
          <div className="pt-6 px-1">
            <div className="p-3.5 rounded-sm bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between text-[9px] text-white/40 font-mono tracking-[0.2em] uppercase mb-1.5">
                <span>Active Target</span>
                <Server className="w-3.5 h-3.5 text-white/60" />
              </div>
              <div className="text-xs font-mono font-medium text-white truncate tracking-wide">
                {selectedVmName}
              </div>
              <div className="text-[9px] text-white/50 mt-1.5 flex items-center gap-1.5 font-mono">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Live Contention Stream</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Admin User Footer */}
      <div className="px-4 py-3.5 border-t border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 bg-gradient-to-br from-white/15 to-transparent flex items-center justify-center font-bold text-xs text-white">
            <User className="w-4 h-4 text-white/80" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-light text-white tracking-wider truncate">
              Admin User
            </span>
            <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono truncate">
              vSphere Node 01
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
