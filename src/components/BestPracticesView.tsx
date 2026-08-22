import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Terminal, 
  Copy, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Info,
  Scale,
  Sparkles
} from 'lucide-react';

export const BestPracticesView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // NUMA Sizing Calculator State
  const [hostPhysicalCoresPerSocket, setHostPhysicalCoresPerSocket] = useState<number>(16);
  const [hostSockets, setHostSockets] = useState<number>(2);
  const [vmVcpuTarget, setVmVcpuTarget] = useState<number>(8);
  const [vmSocketsTarget, setVmSocketsTarget] = useState<number>(2);

  const totalHostCores = hostPhysicalCoresPerSocket * hostSockets;
  const coresPerSocketVm = Math.ceil(vmVcpuTarget / vmSocketsTarget);
  const fitsSingleNuma = vmVcpuTarget <= hostPhysicalCoresPerSocket;
  const overcommitRatio = (vmVcpuTarget / totalHostCores).toFixed(2);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const esxtopCommands = [
    {
      title: 'Launch esxtop in interactive VM mode',
      command: 'esxtop',
      description: 'Run on the ESXi SSH console with root privileges.',
    },
    {
      title: 'Switch to Virtual Machine CPU view',
      command: 'Shift + V',
      description: 'Filters display to show only running Virtual Machine worlds (GIDs).',
    },
    {
      title: 'Field selection for %RDY and %CSTP',
      command: 'f -> toggle J (CPU Summary) -> toggle G (%RDY / %CSTP)',
      description: 'Customizes visible columns to highlight contention metrics.',
    },
    {
      title: 'Set refresh interval to 2 seconds',
      command: 's -> 2 -> Enter',
      description: 'Changes sampling delay to 2 seconds for high-frequency diagnosis.',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10">
      {/* Hero Header */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-light text-white uppercase tracking-[0.2em]">
              vSphere CPU Sizing & Contention Playbook
            </h2>
            <p className="text-xs text-white/40 mt-1 font-light">
              Broadcom / VMware engineering best practices for eliminating CPU Ready and Co-Stop bottlenecks.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive vNUMA & Right-Sizing Calculator */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-white/60" />
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              vNUMA Boundary & Topology Sizer
            </h3>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-widest bg-white/[0.03] border border-white/10 px-2.5 py-1 rounded-sm text-white/60">
            vSphere 7 & 8 Topology Engine
          </span>
        </div>

        <p className="text-xs text-white/40 mb-6 font-light">
          Virtual machines should ideally fit within a single physical NUMA node to prevent remote memory access latency and synchronized co-stop penalties.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4 bg-white/[0.02] p-4 rounded-sm border border-white/10">
            <h4 className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40">
              ESXi Physical Host Parameters
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/50 block mb-1 font-mono">Cores per Physical Socket</label>
                <input
                  type="number"
                  value={hostPhysicalCoresPerSocket}
                  onChange={(e) => setHostPhysicalCoresPerSocket(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-1.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 block mb-1 font-mono">Physical Sockets</label>
                <input
                  type="number"
                  value={hostSockets}
                  onChange={(e) => setHostSockets(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-1.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <h4 className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40 pt-2">
              Target VM Configuration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/50 block mb-1 font-mono">Total vCPUs</label>
                <input
                  type="number"
                  value={vmVcpuTarget}
                  onChange={(e) => setVmVcpuTarget(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-1.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 block mb-1 font-mono">Virtual Sockets</label>
                <input
                  type="number"
                  value={vmSocketsTarget}
                  onChange={(e) => setVmSocketsTarget(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#080808] border border-white/10 px-3 py-1.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Results & Analysis */}
          <div className="bg-white/[0.02] p-4 rounded-sm border border-white/10 flex flex-col justify-between">
            <h4 className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40">
              Topology Assessment
            </h4>

            <div className="space-y-2.5 my-2">
              <div className="flex items-center justify-between p-2.5 rounded-sm bg-[#080808] border border-white/10">
                <span className="text-xs text-white/50">Single NUMA Node Fit</span>
                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-sm border ${
                  fitsSingleNuma ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  {fitsSingleNuma ? '✓ Fits in 1 NUMA Node' : '⚠ Wide vNUMA (Spans Nodes)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-sm bg-[#080808] border border-white/10">
                <span className="text-xs text-white/50">Calculated Cores per Socket</span>
                <span className="text-xs font-mono font-medium text-white">
                  {coresPerSocketVm} cores / virtual socket
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-sm bg-[#080808] border border-white/10">
                <span className="text-xs text-white/50">Host Core Pool Share</span>
                <span className="text-xs font-mono font-medium text-white">
                  {vmVcpuTarget} / {totalHostCores} cores ({(+overcommitRatio * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-white/40 leading-relaxed font-light">
              {fitsSingleNuma 
                ? 'Optimal configuration: Since vCPU count is within a single physical socket boundary (16 cores), ESXi will schedule all vCPUs within one NUMA node with zero cross-socket UPI/QPI interconnect overhead.'
                : 'Notice: This VM exceeds a single NUMA node. ESXi will activate vNUMA. Ensure Cores per Socket is evenly divisible and operating systems support NUMA interleaving.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Sizing Core Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0e0e0e] rounded-sm p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-light uppercase tracking-[0.15em] text-white mb-1.5">
              Rule 1: "Start Small" Sizing
            </h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Allocating more vCPUs than needed actually <span className="text-amber-300 font-normal">degrades performance</span>. The hypervisor must find multiple idle physical cores simultaneously to execute wide SMP worlds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/60">
            Target &lt; 5% %RDY per vCPU
          </div>
        </div>

        <div className="bg-[#0e0e0e] rounded-sm p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-light uppercase tracking-[0.15em] text-white mb-1.5">
              Rule 2: Monitor %CSTP (Co-Stop)
            </h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              If %CSTP exceeds 3%, vCPUs inside the same VM are waiting for each other to sync. The fastest fix is <span className="text-white font-normal">reducing the vCPU count</span> by 50%.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-amber-300">
            Keep %CSTP &lt; 3.0%
          </div>
        </div>

        <div className="bg-[#0e0e0e] rounded-sm p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-light uppercase tracking-[0.15em] text-white mb-1.5">
              Rule 3: Respect Overcommit Ratios
            </h4>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Production tiers (DB, SAP, K8s) should maintain a 1:1 to 2:1 vCPU:pCore ratio. General web and test tiers can support 3:1 to 4:1 before %RDY spikes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#4ade80]">
            Recommended max 3:1
          </div>
        </div>
      </div>

      {/* esxtop Diagnostic Cheat Sheet */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-white/60" />
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              esxtop Command Reference
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            ESXi SSH Diagnostic Commands
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {esxtopCommands.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/[0.02] p-3.5 rounded-sm border border-white/10 flex flex-col justify-between gap-2"
            >
              <div>
                <div className="text-xs font-medium text-white font-mono">
                  {item.title}
                </div>
                <p className="text-[11px] text-white/40 mt-0.5 font-light">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between bg-[#080808] px-3 py-2 rounded-sm border border-white/10">
                <code className="text-xs font-mono text-white font-medium">
                  {item.command}
                </code>
                <button
                  onClick={() => copyToClipboard(item.command, `cmd-${idx}`)}
                  className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer"
                  title="Copy command"
                >
                  {copiedKey === `cmd-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
