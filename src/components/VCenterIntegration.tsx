import React, { useState, useEffect } from 'react';
import { Server, Lock, Loader2, Globe, Database, Cpu, Search, CheckCircle2 } from 'lucide-react';
import { VirtualMachine } from '../types';

interface VCenterIntegrationProps {
  onSelectVm: (vm: VirtualMachine) => void;
  onNavigateAnalyzer: () => void;
}

export const VCenterIntegration: React.FC<VCenterIntegrationProps> = ({ onSelectVm, onNavigateAnalyzer }) => {
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('administrator@vsphere.local');
  const [password, setPassword] = useState('');
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [clusters, setClusters] = useState<any[]>([]);
  const [vms, setVms] = useState<VirtualMachine[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setError(null);
    
    try {
      const res = await fetch('/api/vcenter/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      
      setIsConnected(true);
      setSessionInfo(data.info);
      fetchInfrastructure();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    await fetch('/api/vcenter/disconnect', { method: 'POST' });
    setIsConnected(false);
    setSessionInfo(null);
    setClusters([]);
    setVms([]);
  };

  const fetchInfrastructure = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/vcenter/infrastructure');
      const data = await res.json();
      if (res.ok) {
        setClusters(data.clusters);
        setVms(data.vms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleSelectVm = (vm: any) => {
    // Map to expected format if needed
    const mappedVm: VirtualMachine = {
      ...vm,
      status: vm.readyMs > 5000 ? 'warning' : 'healthy' // Mock status logic
    };
    onSelectVm(mappedVm);
    onNavigateAnalyzer();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10 max-w-2xl mx-auto mt-10">
        <div className="bg-[#0e0e0e] rounded-sm p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-light text-white uppercase tracking-[0.2em] mb-2">
              vCenter Connection
            </h2>
            <p className="text-xs text-white/40 font-light max-w-sm">
              Authenticate with your vCenter Server to automatically retrieve cluster topologies and CPU Ready telemetry.
            </p>
            <div className="mt-4 px-3 py-1.5 rounded-sm bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
              <span>Preview Environment Simulation Mode</span>
            </div>
          </div>

          <form onSubmit={handleConnect} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-sm text-xs text-rose-400 font-mono text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="text-[10px] text-white/50 block mb-1.5 font-mono uppercase tracking-wider">vCenter FQDN or IP</label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="vcenter.corp.local"
                  value={host}
                  onChange={e => setHost(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 pl-10 pr-3 py-2.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1.5 font-mono uppercase tracking-wider">Username</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 pl-10 pr-3 py-2.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1.5 font-mono uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 pl-10 pr-3 py-2.5 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full py-3 rounded-sm bg-white hover:bg-white/90 text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isConnecting ? 'Connecting...' : 'Connect to vCenter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10">
      {/* Connected Status Bar */}
      <div className="bg-[#0e0e0e] rounded-sm p-4 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">{sessionInfo?.host}</div>
              <div className="text-[10px] font-mono text-white/40">Connected (vSphere {sessionInfo?.version})</div>
            </div>
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-1.5 rounded-sm bg-white/[0.03] hover:bg-rose-500/10 text-white/60 hover:text-rose-400 font-mono text-[10px] uppercase font-medium tracking-wider border border-white/10 hover:border-rose-500/20 transition-colors cursor-pointer"
        >
          Disconnect
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hierarchy Tree */}
        <div className="lg:col-span-1 bg-[#0e0e0e] rounded-sm border border-white/10 flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <Database className="w-4 h-4 text-white/60" />
              Inventory
            </h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40 gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Loading Topology...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {clusters.map(cluster => (
                  <div key={cluster.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white mb-2">
                      <Server className="w-3.5 h-3.5" />
                      {cluster.name}
                    </div>
                    {cluster.hosts.map((host: any) => (
                      <div key={host.id} className="pl-5 py-1 text-xs font-mono text-white/60 flex items-center gap-2 border-l border-white/10 ml-2">
                        <Cpu className="w-3 h-3" />
                        {host.name} <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded-sm">{host.cores}c</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VM Data Grid */}
        <div className="lg:col-span-2 bg-[#0e0e0e] rounded-sm border border-white/10 flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <Search className="w-4 h-4 text-white/60" />
              Virtual Machines
            </h3>
            <span className="text-[10px] font-mono bg-white/5 px-2 py-1 border border-white/10 rounded-sm text-white/50">
              {vms.length} Total
            </span>
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-[#0e0e0e] z-10">
                <tr className="bg-white/[0.02] text-white/40 uppercase tracking-[0.2em] text-[9px] border-b border-white/10">
                  <th className="p-3 whitespace-nowrap">VM Name</th>
                  <th className="p-3">Cluster</th>
                  <th className="p-3 text-center">vCPU</th>
                  <th className="p-3 text-right">Ready (ms)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vms.map((vm) => {
                  const rdy = ((vm.readyMs * 100) / (vm.intervalSec * 1000)) / vm.vcpu;
                  return (
                    <tr key={vm.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3 text-white font-medium">{vm.name}</td>
                      <td className="p-3 text-white/50">{vm.cluster}</td>
                      <td className="p-3 text-center text-white/80">{vm.vcpu}</td>
                      <td className="p-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-white/60">{vm.readyMs.toLocaleString()}</span>
                          <span className={`text-[9px] ${rdy >= 5 ? 'text-amber-400' : 'text-[#4ade80]'}`}>{rdy.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleSelectVm(vm)}
                          className="px-3 py-1 rounded-sm bg-white/10 hover:bg-white text-white hover:text-black text-[9px] uppercase font-bold tracking-widest transition-all border border-white/15 cursor-pointer whitespace-nowrap"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
