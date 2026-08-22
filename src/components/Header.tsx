import React, { useState, useRef, useEffect } from 'react';
import { VirtualMachine, AlertNotification } from '../types';
import { 
  Search, 
  Bell, 
  RefreshCw, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  virtualMachines: VirtualMachine[];
  selectedVm: VirtualMachine | null;
  onSelectVm: (vm: VirtualMachine) => void;
  notifications: AlertNotification[];
  onDismissNotification: (id: string) => void;
  onRefreshTelemetry: () => void;
  isRefreshing: boolean;
  clusterStatusText: string;
}

export const Header: React.FC<HeaderProps> = ({
  virtualMachines,
  selectedVm,
  onSelectVm,
  notifications,
  onDismissNotification,
  onRefreshTelemetry,
  isRefreshing,
  clusterStatusText,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const filteredVms = virtualMachines.filter((vm) =>
    vm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vm.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vm.cluster.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#080808]/90 backdrop-blur-md z-40 flex items-center justify-between px-8 border-b border-white/10 select-none">
      {/* Search Bar with Autocomplete Dropdown */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search Virtual Machines, ESXi Hosts, Clusters..."
            className="w-full bg-white/[0.03] text-white placeholder-white/30 text-xs tracking-wide pl-10 pr-9 py-2 rounded-sm border border-white/10 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown Menu */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-12 bg-[#0e0e0e] border border-white/15 rounded-sm shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="p-2.5 border-b border-white/10 text-[9px] uppercase font-mono font-light tracking-[0.25em] text-white/40 flex justify-between">
              <span>Virtual Machines ({filteredVms.length})</span>
              <span>Quick Select</span>
            </div>
            {filteredVms.length === 0 ? (
              <div className="p-4 text-center text-xs text-white/40 font-mono">
                No matching virtual machines found.
              </div>
            ) : (
              filteredVms.map((vm) => {
                const isSelected = selectedVm?.id === vm.id;
                return (
                  <button
                    key={vm.id}
                    onClick={() => {
                      onSelectVm(vm);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full p-2.5 flex items-center justify-between text-left hover:bg-white/[0.05] transition-colors border-b border-white/5 last:border-0 ${
                      isSelected ? 'bg-white/[0.08]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Server className="w-4 h-4 text-white/60 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-mono text-white truncate">
                          {vm.name}
                        </div>
                        <div className="text-[10px] text-white/40 truncate">
                          {vm.host} • {vm.cluster}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-white/10 font-mono text-white/80 border border-white/10">
                        {vm.vcpu} vCPU
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wider font-semibold border ${
                          vm.status === 'healthy'
                            ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20'
                            : vm.status === 'warning'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}
                      >
                        {vm.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Cluster Status, Notifications, Refresh */}
      <div className="flex items-center gap-6 ml-8">
        {/* System Status Display */}
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-light text-white/40 uppercase tracking-[0.25em] font-mono">
            System Status
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
            <span className="text-xs font-mono font-normal text-white">
              {clusterStatusText || 'Cluster Optimized'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Notifications Popover Toggle */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 hover:bg-white/10 rounded-sm transition-colors text-white/60 hover:text-white relative border border-transparent hover:border-white/10"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-white text-black font-bold text-[8px] flex items-center justify-center font-mono ring-2 ring-[#080808]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 top-12 w-88 bg-[#0e0e0e] border border-white/15 rounded-sm shadow-2xl overflow-hidden z-50">
                <div className="p-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-white" />
                    <span className="text-xs font-light text-white uppercase tracking-[0.2em] font-mono">
                      Contention Alerts
                    </span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-sm bg-white/10 border border-white/10 font-mono text-white/80">
                    {notifications.length} alerts
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 hover:bg-white/[0.03] transition-colors flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        {notif.severity === 'critical' ? (
                          <AlertOctagon className="w-4 h-4 text-rose-400" />
                        ) : notif.severity === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Info className="w-4 h-4 text-white/70" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium text-white truncate">
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-white/40 font-mono shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-white/[0.04] text-white/80 border border-white/10">
                            {notif.vmName}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDismissNotification(notif.id)}
                        className="text-white/40 hover:text-white p-1"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Refresh / Telemetry Fetch Button */}
          <button
            onClick={onRefreshTelemetry}
            disabled={isRefreshing}
            className={`p-2 hover:bg-white/10 rounded-sm transition-all text-white/60 hover:text-white border border-transparent hover:border-white/10 ${
              isRefreshing ? 'opacity-50' : ''
            }`}
            title="Poll Latest vCenter Metrics"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-white' : ''}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
