import React, { useState } from 'react';
import { VirtualMachine } from '../types';
import { generateHistoricalData } from '../data/mockData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  History, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Server, 
  Calendar, 
  Download,
  Filter
} from 'lucide-react';

interface HistoricalTrendsViewProps {
  currentVm: VirtualMachine | null;
  virtualMachines: VirtualMachine[];
  onSelectVm: (vm: VirtualMachine) => void;
}

export const HistoricalTrendsView: React.FC<HistoricalTrendsViewProps> = ({
  currentVm,
  virtualMachines,
  onSelectVm,
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activeMetric, setActiveMetric] = useState<'readyPercent' | 'cstpPercent' | 'cpuUsedPercent'>('readyPercent');

  const vm = currentVm || virtualMachines[0];
  const pointsCount = timeRange === '24h' ? 24 : timeRange === '7d' ? 28 : 30;
  const data = generateHistoricalData(vm.readyMs, vm.intervalSec, vm.vcpu, pointsCount);

  // Calculate high-water mark and average
  const maxRdy = Math.max(...data.map((d) => d.readyPercent));
  const avgRdy = (data.reduce((acc, curr) => acc + curr.readyPercent, 0) / data.length).toFixed(2);
  const contentionSpikes = data.filter((d) => d.readyPercent >= 5.0).length;

  return (
    <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10">
      {/* Top Header & Filters Bar */}
      <div className="bg-[#0e0e0e] rounded-sm p-5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-white" />
            <h2 className="text-base font-light text-white uppercase tracking-[0.2em]">
              CPU Contention Historical Trends
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-1 font-light">
            Analyze CPU Ready (%RDY), Co-Stop (%CSTP), and CPU Utilization time-series telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* VM Switcher Dropdown */}
          <div className="relative flex items-center bg-white/[0.03] rounded-sm border border-white/10 px-3 py-1.5">
            <Server className="w-3.5 h-3.5 text-white/50 mr-2" />
            <select
              value={vm.id}
              onChange={(e) => {
                const target = virtualMachines.find((v) => v.id === e.target.value);
                if (target) onSelectVm(target);
              }}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer pr-4"
            >
              {virtualMachines.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#0e0e0e] text-white">
                  {v.name} ({v.vcpu} vCPU)
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Pills */}
          <div className="flex bg-white/[0.03] p-0.5 rounded-sm border border-white/10">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-[10px] font-mono font-medium rounded-sm transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Metric Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e0e0e] rounded-sm p-4 border border-white/10 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40">
            Target VM & Sizing
          </span>
          <div className="text-base font-light font-mono text-white mt-2 truncate">
            {vm.name}
          </div>
          <span className="text-[10px] text-white/40 font-mono mt-1">
            {vm.vcpu} vCPU • {vm.memoryGb} GB RAM
          </span>
        </div>

        <div className="bg-[#0e0e0e] rounded-sm p-4 border border-white/10 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40">
            Average %RDY ({timeRange})
          </span>
          <div className="text-2xl font-light font-mono text-white mt-1">
            {avgRdy}%
          </div>
          <span className="text-[10px] text-white/40 font-mono mt-1">
            Baseline scheduler load
          </span>
        </div>

        <div className="bg-[#0e0e0e] rounded-sm p-4 border border-white/10 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40">
            Peak %RDY Spike
          </span>
          <div className={`text-2xl font-light font-mono mt-1 ${
            maxRdy >= 10 ? 'text-rose-400' : maxRdy >= 5 ? 'text-amber-300' : 'text-[#4ade80]'
          }`}>
            {maxRdy.toFixed(2)}%
          </div>
          <span className="text-[10px] text-white/40 font-mono mt-1">
            Highest contention window
          </span>
        </div>

        <div className="bg-[#0e0e0e] rounded-sm p-4 border border-white/10 flex flex-col justify-between">
          <span className="text-[9px] font-mono font-light uppercase tracking-[0.25em] text-white/40">
            Contention Events (&gt;5%)
          </span>
          <div className="text-2xl font-light font-mono text-amber-300 mt-1">
            {contentionSpikes} <span className="text-xs text-white/40 font-light">periods</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono mt-1">
            Hypervisor scheduling backlog
          </span>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              Telemetry Trend Stream
            </h3>
            <span className="text-[11px] text-white/40 font-light">
              Threshold lines at 5.0% (Warning) and 10.0% (Critical Contention)
            </span>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex bg-white/[0.03] p-1 rounded-sm border border-white/10">
            <button
              onClick={() => setActiveMetric('readyPercent')}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                activeMetric === 'readyPercent'
                  ? 'bg-white text-black font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              %RDY (Ready)
            </button>
            <button
              onClick={() => setActiveMetric('cstpPercent')}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                activeMetric === 'cstpPercent'
                  ? 'bg-amber-400 text-black font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              %CSTP (Co-Stop)
            </button>
            <button
              onClick={() => setActiveMetric('cpuUsedPercent')}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                activeMetric === 'cpuUsedPercent'
                  ? 'bg-white/30 text-white font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              %USED (Utilization)
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="readyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cstpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="usedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#666666" fontSize={10} fontFamily="JetBrains Mono" />
              <YAxis stroke="#666666" fontSize={10} fontFamily="JetBrains Mono" unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e0e0e',
                  borderColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                }}
              />
              <Legend />

              {/* Threshold Lines */}
              {activeMetric === 'readyPercent' && (
                <>
                  <ReferenceLine
                    y={5.0}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{ value: 'Warning 5%', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }}
                  />
                  <ReferenceLine
                    y={10.0}
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    label={{ value: 'Critical 10%', fill: '#f43f5e', fontSize: 9, position: 'insideTopRight' }}
                  />
                </>
              )}

              {activeMetric === 'readyPercent' && (
                <Area
                  type="monotone"
                  dataKey="readyPercent"
                  name="%RDY (CPU Ready)"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  fill="url(#readyGrad)"
                />
              )}

              {activeMetric === 'cstpPercent' && (
                <Area
                  type="monotone"
                  dataKey="cstpPercent"
                  name="%CSTP (Co-Stop)"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  fill="url(#cstpGrad)"
                />
              )}

              {activeMetric === 'cpuUsedPercent' && (
                <Area
                  type="monotone"
                  dataKey="cpuUsedPercent"
                  name="%USED (CPU Active)"
                  stroke="#4ade80"
                  strokeWidth={1.5}
                  fill="url(#usedGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cluster VM Comparison Grid */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
        <h3 className="text-xs font-light text-white uppercase tracking-[0.2em] mb-1">
          Cluster-Wide Contention Matrix
        </h3>
        <p className="text-xs text-white/40 mb-4 font-light">
          All virtual machines in {vm.cluster} ranked by CPU Ready contention.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] text-white/40 uppercase tracking-[0.2em] text-[9px] border-b border-white/10">
                <th className="p-3">VM Name</th>
                <th className="p-3">ESXi Host</th>
                <th className="p-3 text-center">vCPUs</th>
                <th className="p-3 text-right">Ready (ms)</th>
                <th className="p-3 text-right">Computed %RDY</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {virtualMachines.map((v) => {
                const rdy = ((v.readyMs * 100) / (v.intervalSec * 1000)) / v.vcpu;
                const isSelected = v.id === vm.id;
                return (
                  <tr
                    key={v.id}
                    className={`hover:bg-white/[0.03] transition-colors ${
                      isSelected ? 'bg-white/[0.06] text-white font-medium' : ''
                    }`}
                  >
                    <td className="p-3 text-white font-mono">
                      {v.name}
                    </td>
                    <td className="p-3 text-white/50">{v.host}</td>
                    <td className="p-3 text-center text-white/80">{v.vcpu}</td>
                    <td className="p-3 text-right text-white/60">{v.readyMs.toLocaleString()} ms</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded-sm font-medium ${
                        rdy >= 10 ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : rdy >= 5 ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20' : 'text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20'
                      }`}>
                        {rdy.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded-sm font-medium border ${
                        v.status === 'healthy' ? 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20' : v.status === 'warning' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onSelectVm(v)}
                        className="px-3 py-1 rounded-sm bg-white/10 hover:bg-white text-white hover:text-black text-[9px] uppercase font-bold tracking-widest transition-all border border-white/15 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
