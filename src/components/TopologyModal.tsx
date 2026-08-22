import React from 'react';
import { VirtualMachine } from '../types';
import { 
  Layers, 
  X, 
  Server, 
  Cpu, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon,
  HardDrive
} from 'lucide-react';

interface TopologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  virtualMachines: VirtualMachine[];
  onSelectVm: (vm: VirtualMachine) => void;
}

export const TopologyModal: React.FC<TopologyModalProps> = ({
  isOpen,
  onClose,
  virtualMachines,
  onSelectVm,
}) => {
  if (!isOpen) return null;

  // Group VMs by Host
  const hosts = Array.from(new Set(virtualMachines.map((v) => v.host)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#0e0e0e] border border-white/15 rounded-sm shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
                ESXi Cluster Topology & Scheduler Map
              </h3>
              <p className="text-xs text-white/40 mt-0.5 font-light">
                Live CPU Ready contention and resource distribution across physical ESXi nodes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 text-white/40 hover:text-white rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cluster Graphic Topology Overview */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hosts.map((hostName) => {
              const hostVms = virtualMachines.filter((v) => v.host === hostName);
              const totalVcpuOnHost = hostVms.reduce((acc, curr) => acc + curr.vcpu, 0);
              const hasCritical = hostVms.some((v) => v.status === 'critical');
              const hasWarning = hostVms.some((v) => v.status === 'warning');

              return (
                <div
                  key={hostName}
                  className={`p-4 rounded-sm border transition-all ${
                    hasCritical
                      ? 'bg-white/[0.02] border-rose-500/30'
                      : hasWarning
                      ? 'bg-white/[0.02] border-amber-500/30'
                      : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-white/60" />
                      <span className="text-xs font-mono font-medium text-white">
                        {hostName}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-white/50">
                      {totalVcpuOnHost} vCPUs allocated
                    </span>
                  </div>

                  {/* VM slots on this host */}
                  <div className="space-y-2">
                    {hostVms.map((vm) => {
                      const rdyPercent = ((vm.readyMs * 100) / (vm.intervalSec * 1000)) / vm.vcpu;
                      return (
                        <div
                          key={vm.id}
                          onClick={() => {
                            onSelectVm(vm);
                            onClose();
                          }}
                          className="p-2.5 rounded-sm bg-[#080808] hover:bg-white/[0.05] cursor-pointer transition-colors flex items-center justify-between border border-white/10"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Cpu className="w-3.5 h-3.5 text-white/40 shrink-0" />
                            <span className="text-xs font-mono text-white truncate">
                              {vm.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-white/40">
                              {vm.vcpu} vCPU
                            </span>
                            <span
                              className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-sm border ${
                                rdyPercent >= 10
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : rdyPercent >= 5
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                  : 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20'
                              }`}
                            >
                              {rdyPercent.toFixed(2)}% RDY
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex justify-between items-center text-xs text-white/40 font-mono">
          <span>Select any VM to inspect and recalculate contention.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-sm bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase font-bold tracking-widest transition-all border border-white/20 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
