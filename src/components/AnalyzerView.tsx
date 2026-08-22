import React, { useState, useEffect } from 'react';
import { STANDARD_INTERVALS, calculateRdyPercentage } from '../data/mockData';
import { ThresholdStatus, VirtualMachine } from '../types';
import { 
  Calculator, 
  ArrowRight, 
  Sliders, 
  BookOpen, 
  Clock, 
  Cpu, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon,
  Minus,
  Plus,
  ChevronDown,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';

interface AnalyzerViewProps {
  currentVm: VirtualMachine | null;
  onOpenTopologyModal: () => void;
  onApplyVcpuRecommendation?: (newVcpu: number) => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  currentVm,
  onOpenTopologyModal,
  onApplyVcpuRecommendation,
}) => {
  // Input states
  const [readyMs, setReadyMs] = useState<number>(1200);
  const [intervalSec, setIntervalSec] = useState<number>(300);
  const [vcpuCount, setVcpuCount] = useState<number>(4);

  // Sync with selected VM if it changes
  useEffect(() => {
    if (currentVm) {
      setReadyMs(currentVm.readyMs);
      setIntervalSec(currentVm.intervalSec);
      setVcpuCount(currentVm.vcpu);
    }
  }, [currentVm]);

  // Calculations
  const intervalMs = intervalSec * 1000;
  const computedPercentage = calculateRdyPercentage(readyMs, intervalSec, vcpuCount);

  // Determine status
  let status: ThresholdStatus = 'healthy';
  let statusLabel = 'Healthy';
  let badgeBg = 'bg-white/5 border border-white/20 text-white';
  let dotColor = 'bg-[#4ade80]';
  let gaugeColor = '#ffffff';

  if (computedPercentage < 5) {
    status = 'healthy';
    statusLabel = 'Healthy';
    badgeBg = 'bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]';
    dotColor = 'bg-[#4ade80]';
    gaugeColor = '#ffffff';
  } else if (computedPercentage >= 5 && computedPercentage <= 10) {
    status = 'warning';
    statusLabel = 'Warning (Contention)';
    badgeBg = 'bg-amber-500/10 border border-amber-500/30 text-amber-300';
    dotColor = 'bg-amber-400';
    gaugeColor = '#f59e0b';
  } else {
    status = 'critical';
    statusLabel = 'Critical Contention';
    badgeBg = 'bg-rose-500/10 border border-rose-500/30 text-rose-300';
    dotColor = 'bg-rose-400';
    gaugeColor = '#f43f5e';
  }

  // Gauge calculation (Circumference: 2 * PI * 45 ≈ 282.74)
  const maxScale = 20; // 0% to 20% on visual arc
  const clampedVal = Math.min(Math.max(computedPercentage, 0), maxScale);
  const strokeDashoffset = 282.74 - (282.74 * (clampedVal / maxScale));

  const handleAdjustVcpu = (delta: number) => {
    setVcpuCount((prev) => Math.max(1, Math.min(128, prev + delta)));
  };

  // Prediction scenarios: 1, 2, 4, 8, 16 depending on current vCPU
  const getPredictionVcpus = () => {
    let list = [1, 2, 4, 8];
    if (vcpuCount > 4 && vcpuCount <= 16) list = [2, 4, 8, 16];
    else if (vcpuCount > 16) list = [4, 8, 16, 32];
    
    if (!list.includes(vcpuCount)) {
      list.push(vcpuCount);
      list.sort((a, b) => a - b);
    }
    return list.slice(0, 4);
  };

  const predictionVcpus = getPredictionVcpus();

  return (
    <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calculator, Gauge, Threshold Analysis, Predictions (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Interactive Calculator Card */}
          <div className="bg-[#0e0e0e] rounded-sm relative overflow-hidden border border-white/10 group shadow-xl">
            <div className="relative p-6 flex flex-col gap-5">
              {/* Card Title & Icon */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-light text-white font-sans tracking-wider uppercase">
                      %RDY Analyzer
                    </h2>
                    {currentVm && (
                      <span className="text-[9px] px-2 py-0.5 rounded-sm bg-white/10 text-white font-mono border border-white/20 tracking-wider">
                        {currentVm.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-1 font-light tracking-wide">
                    Calculate true CPU contention percentage from absolute milliseconds.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/15 flex items-center justify-center text-white">
                  <Calculator className="w-4 h-4" />
                </div>
              </div>

              {/* 3 Input Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {/* CPU Ready MS */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-light text-white/40 uppercase tracking-[0.25em] font-mono">
                    CPU Ready (ms)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={readyMs}
                      onChange={(e) => setReadyMs(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="e.g. 1200"
                      className="w-full bg-white/[0.03] text-white font-mono text-base px-4 py-2.5 rounded-sm border border-white/10 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 text-right pr-4 pl-12 transition-all"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-normal text-white/40">
                      ms
                    </span>
                  </div>
                </div>

                {/* Interval Seconds */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-light text-white/40 uppercase tracking-[0.25em] font-mono">
                    Interval (seconds)
                  </label>
                  <div className="relative">
                    <select
                      value={intervalSec}
                      onChange={(e) => setIntervalSec(parseInt(e.target.value) || 300)}
                      className="w-full bg-[#0e0e0e] text-white font-mono text-xs px-4 py-2.5 rounded-sm border border-white/10 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 appearance-none cursor-pointer pr-10 transition-all"
                    >
                      <option value="20" className="bg-[#0e0e0e] text-white">20s (Real-time)</option>
                      <option value="300" className="bg-[#0e0e0e] text-white">300s (Day)</option>
                      <option value="1800" className="bg-[#0e0e0e] text-white">1800s (Week)</option>
                      <option value="7200" className="bg-[#0e0e0e] text-white">7200s (Month)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* vCPU Count with Increment / Decrement */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-light text-white/40 uppercase tracking-[0.25em] font-mono">
                    vCPU Count
                  </label>
                  <div className="relative flex items-center bg-white/[0.03] rounded-sm border border-white/10 overflow-hidden focus-within:border-white/40 transition-all">
                    <button
                      type="button"
                      onClick={() => handleAdjustVcpu(-1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-colors border-r border-white/10"
                      title="Decrease vCPU"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="128"
                      value={vcpuCount}
                      onChange={(e) => setVcpuCount(Math.max(1, Math.min(128, parseInt(e.target.value) || 1)))}
                      className="flex-1 bg-transparent text-center text-white font-mono text-base py-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustVcpu(1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-colors border-l border-white/10"
                      title="Increase vCPU"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Formula & Calculate Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2 bg-white/[0.02] p-3.5 rounded-sm border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-light uppercase tracking-[0.25em] text-white/40 font-mono">
                    Calculation Formula
                  </span>
                  <span className="font-mono text-xs text-white/90 mt-0.5 tracking-wider font-light">
                    ((MS × 100) / (Interval × 1000)) / vCPUs
                  </span>
                </div>

                <button
                  onClick={() => {
                    setReadyMs((prev) => prev);
                  }}
                  className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-opacity-90 transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer rounded-sm"
                >
                  <span>Calculate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results: Gauge Display & Threshold Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Large Result Display with Radial Gauge */}
            <div className="bg-[#0e0e0e] rounded-sm p-6 flex flex-col items-center justify-center relative overflow-hidden border border-white/10 min-h-[280px]">
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[9px] font-light font-mono text-white/40 uppercase tracking-[0.3em] mb-4">
                  Computed %RDY
                </span>

                {/* Gauge Visualization */}
                <div className="relative w-44 h-44 flex items-center justify-center mb-4">
                  <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="5"
                    />
                    {/* Dynamic animated colored progress arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="5"
                      strokeDasharray="282.74"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Percentage Value Centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-light font-mono text-white tracking-tighter flex items-baseline">
                      {computedPercentage.toFixed(2)}
                      <span className="text-lg font-light text-white/40 ml-0.5">%</span>
                    </span>
                    <span className="text-[9px] font-mono text-white/40 mt-1 uppercase tracking-widest">
                      per vCPU
                    </span>
                  </div>
                </div>

                {/* Status Pill Badge */}
                <div className={`px-4 py-1 rounded-full text-[10px] uppercase font-medium font-mono tracking-wider transition-all duration-500 flex items-center gap-2 ${badgeBg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                  <span>{statusLabel}</span>
                </div>
              </div>
            </div>

            {/* Threshold Analysis Card */}
            <div className="bg-[#0e0e0e] rounded-sm p-6 flex flex-col justify-between border border-white/10">
              <div>
                <h3 className="text-sm font-light text-white uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-white/60" />
                  <span>Threshold Analysis</span>
                </h3>
                <p className="text-xs text-white/40 leading-relaxed mb-4 font-light">
                  VMware recommends keeping CPU Ready below 5% per vCPU. Higher values indicate hypervisor scheduling contention.
                </p>
              </div>

              {/* 3 Threshold Levels with Active Highlight */}
              <div className="flex flex-col gap-2.5">
                {/* Level 1: < 5% */}
                <div
                  className={`p-3 rounded-sm flex items-start gap-3 transition-all border ${
                    status === 'healthy'
                      ? 'bg-white/[0.04] border-[#4ade80]/40'
                      : 'bg-white/[0.01] border-white/5 opacity-40'
                  }`}
                >
                  <div className="w-1 self-stretch rounded-full bg-[#4ade80] min-h-[30px] shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-medium text-[#4ade80] tracking-wide">
                      &lt; 5% RDY
                    </span>
                    <span className="text-xs text-white/70 font-light mt-0.5">
                      Optimal performance. No action needed.
                    </span>
                  </div>
                </div>

                {/* Level 2: 5% - 10% */}
                <div
                  className={`p-3 rounded-sm flex items-start gap-3 transition-all border ${
                    status === 'warning'
                      ? 'bg-white/[0.04] border-amber-500/40'
                      : 'bg-white/[0.01] border-white/5 opacity-40'
                  }`}
                >
                  <div className="w-1 self-stretch rounded-full bg-amber-400 min-h-[30px] shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-medium text-amber-300 tracking-wide">
                      5% - 10% RDY
                    </span>
                    <span className="text-xs text-white/70 font-light mt-0.5">
                      Contention detected. Monitor closely.
                    </span>
                  </div>
                </div>

                {/* Level 3: > 10% */}
                <div
                  className={`p-3 rounded-sm flex items-start gap-3 transition-all border ${
                    status === 'critical'
                      ? 'bg-white/[0.04] border-rose-500/40'
                      : 'bg-white/[0.01] border-white/5 opacity-40'
                  }`}
                >
                  <div className="w-1 self-stretch rounded-full bg-rose-400 min-h-[30px] shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-medium text-rose-300 tracking-wide">
                      &gt; 10% RDY
                    </span>
                    <span className="text-xs text-white/70 font-light mt-0.5">
                      Severe contention. Reduce vCPUs or migrate.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right-Sizing Predictions Panel */}
          <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-light text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-white/60" />
                <span>Right-Sizing Predictions</span>
              </h3>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 bg-white/[0.04] px-2 py-0.5 rounded-sm border border-white/10">
                Click Card to Test Sizing
              </span>
            </div>
            <p className="text-xs text-white/40 mb-4 font-light">
              Simulated %RDY impact if vCPU allocation is adjusted for the current absolute ms value.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {predictionVcpus.map((testVcpu) => {
                const predPercentage = calculateRdyPercentage(readyMs, intervalSec, testVcpu);
                const isCurrent = testVcpu === vcpuCount;

                let colorText = 'text-white';
                if (predPercentage >= 5 && predPercentage <= 10) colorText = 'text-amber-300';
                else if (predPercentage > 10) colorText = 'text-rose-300';

                return (
                  <button
                    key={testVcpu}
                    type="button"
                    onClick={() => {
                      setVcpuCount(testVcpu);
                      if (onApplyVcpuRecommendation) {
                        onApplyVcpuRecommendation(testVcpu);
                      }
                    }}
                    className={`p-3.5 rounded-sm flex flex-col justify-between relative overflow-hidden text-left transition-all hover:border-white/30 cursor-pointer ${
                      isCurrent
                        ? 'bg-white/10 border border-white/30 shadow-lg'
                        : 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/10'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute top-0 right-0 bg-white text-black text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest">
                        Current
                      </div>
                    )}
                    <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider mb-2">
                      {testVcpu} vCPU
                    </span>
                    <span className={`font-mono text-lg font-light tracking-tight ${colorText}`}>
                      {predPercentage.toFixed(2)}%
                    </span>
                    <span className="text-[9px] text-white/40 font-mono mt-1.5 uppercase tracking-wider">
                      {predPercentage < 5 ? '✓ Optimal' : predPercentage <= 10 ? '⚠ Monitor' : '✕ Critical'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Reference & Context (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Broadcom KB Reference Card */}
          <div className="bg-[#0e0e0e] rounded-sm p-5 relative overflow-hidden border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-white" />
              <h3 className="text-xs font-light text-white uppercase tracking-[0.2em] font-sans">
                Broadcom KB 387750
              </h3>
            </div>

            <div className="text-xs text-white/50 space-y-3 leading-relaxed font-light">
              <p>
                Converting absolute CPU Ready summation values to a percentage is essential for accurate performance troubleshooting in vSphere.
              </p>

              <div className="bg-white/[0.03] p-3 rounded-sm border border-white/10">
                <span className="block text-[9px] font-mono uppercase tracking-widest font-light text-white/40 mb-1">
                  The Formula
                </span>
                <code className="text-white font-mono text-xs block break-all font-normal">
                  ((Ready ms * 100) / (Interval ms)) / vCPUs
                </code>
              </div>

              <p className="text-[10px] text-white/40 italic">
                Note: The interval must be converted from seconds to milliseconds (Interval × 1000) for the calculation to be accurate.
              </p>
            </div>
          </div>

          {/* Standard vCenter Intervals Table */}
          <div className="bg-[#0e0e0e] rounded-sm overflow-hidden flex flex-col border border-white/10">
            <div className="p-3.5 bg-white/[0.02] flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/60" />
                <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
                  Standard vCenter Intervals
                </h3>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                Select
              </span>
            </div>

            <div className="w-full text-xs">
              {/* Header row */}
              <div className="grid grid-cols-3 px-4 py-2 bg-white/[0.01] text-[9px] font-mono font-light text-white/30 uppercase tracking-[0.2em] border-b border-white/5">
                <div>Rollup</div>
                <div className="text-right">Seconds</div>
                <div className="text-right">Interval MS</div>
              </div>

              {/* Data rows */}
              <div className="divide-y divide-white/5">
                {STANDARD_INTERVALS.map((opt) => {
                  const isSelected = intervalSec === opt.seconds;
                  return (
                    <button
                      key={opt.rollup}
                      type="button"
                      onClick={() => setIntervalSec(opt.seconds)}
                      className={`w-full grid grid-cols-3 px-4 py-2.5 items-center transition-colors text-left cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 text-white font-medium border-l-2 border-white'
                          : 'hover:bg-white/[0.04] text-white/60'
                      }`}
                    >
                      <div className="font-mono text-xs text-white">
                        {opt.rollup}
                      </div>
                      <div
                        className={`text-right font-mono text-xs ${
                          isSelected ? 'text-white font-semibold' : 'text-white/60'
                        }`}
                      >
                        {opt.seconds}s
                      </div>
                      <div className="text-right font-mono text-xs text-white/40">
                        {opt.intervalMs.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ambient Visual / Interactive Topology Preview */}
          <div 
            onClick={onOpenTopologyModal}
            className="flex-1 min-h-[160px] bg-[#0e0e0e] rounded-sm relative overflow-hidden group cursor-pointer border border-white/10"
            title="Click to open cluster topology visualizer"
          >
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#080808]/80 p-4 text-center group-hover:bg-[#080808]/60 transition-colors">
              <Layers className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-light font-mono text-white uppercase tracking-[0.25em]">
                Cluster Topology
              </span>
              <span className="text-[9px] text-white/40 font-mono mt-1 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-white/60" />
                Inspect ESXi Nodes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
