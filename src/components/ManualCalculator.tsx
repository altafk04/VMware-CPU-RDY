import React, { useState } from 'react';
import { Activity, Copy, Check, Calculator, Clock, Cpu, Server, ServerCog } from 'lucide-react';

export const ManualCalculator: React.FC = () => {
  const [vcpu, setVcpu] = useState<number>(4);
  const [readyMs, setReadyMs] = useState<number>(1000);
  const [intervalSec, setIntervalSec] = useState<number>(20);
  const [cluster, setCluster] = useState<string>('Custom-Cluster');
  const [host, setHost] = useState<string>('esxi-custom.local');
  const [vmName, setVmName] = useState<string>('custom-vm-01');
  const [copied, setCopied] = useState(false);
  const [savedRecords, setSavedRecords] = useState<any[]>([]);

  // Calculation
  const rdyPercent = ((readyMs * 100) / (intervalSec * 1000)) / vcpu;
  const isWarning = rdyPercent >= 5.0 && rdyPercent < 10.0;
  const isCritical = rdyPercent >= 10.0;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${rdyPercent.toFixed(2)}%`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const newRecord = {
      id: Date.now().toString(),
      cluster,
      host,
      vmName,
      vcpu,
      readyMs,
      intervalSec,
      rdyPercent,
      timestamp: new Date().toLocaleTimeString()
    };
    setSavedRecords([newRecord, ...savedRecords].slice(0, 5));
  };

  return (
    <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10">
      {/* Header */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-light text-white uppercase tracking-[0.2em]">
              Manual CPU Ready Calculator
            </h2>
            <p className="text-xs text-white/40 mt-1 font-light">
              Convert raw measurement polling data (ms) into per-vCPU %RDY metrics.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white/60" />
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              Input Variables
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">
                Measurement Interval (Seconds)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <select
                  value={intervalSec}
                  onChange={(e) => setIntervalSec(Number(e.target.value))}
                  className="w-full bg-[#080808] border border-white/10 pl-9 pr-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30 appearance-none"
                >
                  <option value={20}>20s (esxtop / vCenter Realtime)</option>
                  <option value={300}>300s (vCenter 5min)</option>
                  <option value={1800}>1800s (vCenter 30min)</option>
                  <option value={7200}>7200s (vCenter 2hr)</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">
                CPU Ready Summation (ms)
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="number"
                  value={readyMs}
                  onChange={(e) => setReadyMs(Number(e.target.value))}
                  className="w-full bg-[#080808] border border-white/10 pl-9 pr-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">
                Allocated vCPUs
              </label>
              <div className="relative">
                <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  type="number"
                  value={vcpu}
                  onChange={(e) => setVcpu(Number(e.target.value))}
                  min={1}
                  className="w-full bg-[#080808] border border-white/10 pl-9 pr-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="col-span-full pt-4 border-t border-white/5 space-y-4">
              <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">
                Optional Context (For Records)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">VM Name</label>
                  <input
                    type="text"
                    value={vmName}
                    onChange={(e) => setVmName(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">Host / Node</label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="w-full bg-[#080808] border border-white/10 px-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <ServerCog className="w-4 h-4 text-white/60" />
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              Calculation Result
            </h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#080808] border border-white/5 rounded-sm relative">
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4">
              Per-vCPU %RDY
            </div>
            
            <div className={`text-6xl font-light font-mono tracking-tight ${
              isCritical ? 'text-rose-400' : isWarning ? 'text-amber-300' : 'text-[#4ade80]'
            }`}>
              {rdyPercent.toFixed(2)}%
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-sm bg-white/[0.03] hover:bg-white/10 text-white font-mono text-[10px] uppercase font-medium tracking-wider flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Value'}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black font-mono text-[10px] uppercase font-bold tracking-widest transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-mono py-1 border-b border-white/5">
              <span className="text-white/50">Formula</span>
              <span className="text-white/80">((MS × 100) / (Interval × 1000)) / vCPU</span>
            </div>
            <div className="flex justify-between text-xs font-mono py-1 border-b border-white/5">
              <span className="text-white/50">Interval Base</span>
              <span className="text-white/80">{intervalSec * 1000} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* History Log */}
      {savedRecords.length > 0 && (
        <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
          <h3 className="text-xs font-light text-white uppercase tracking-[0.2em] mb-4">
            Recent Calculations Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-white/[0.02] text-white/40 uppercase tracking-[0.2em] text-[9px] border-b border-white/10">
                  <th className="p-3">Time</th>
                  <th className="p-3">VM Name</th>
                  <th className="p-3 text-center">vCPU</th>
                  <th className="p-3 text-right">Ready (ms)</th>
                  <th className="p-3 text-right">%RDY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {savedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3 text-white/50">{record.timestamp}</td>
                    <td className="p-3 text-white">{record.vmName}</td>
                    <td className="p-3 text-center text-white/80">{record.vcpu}</td>
                    <td className="p-3 text-right text-white/60">{record.readyMs.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded-sm font-medium ${
                        record.rdyPercent >= 10 ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 
                        record.rdyPercent >= 5 ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20' : 
                        'text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20'
                      }`}>
                        {record.rdyPercent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
