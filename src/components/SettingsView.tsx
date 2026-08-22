import React, { useState } from 'react';
import { AppSettings, VirtualMachine } from '../types';
import { 
  Settings, 
  Sliders, 
  Server, 
  Download, 
  Bell, 
  Check, 
  RotateCcw,
  FileJson,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  virtualMachines: VirtualMachine[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  virtualMachines,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaultSettings: AppSettings = {
      warningThreshold: 5.0,
      criticalThreshold: 10.0,
      clusterName: 'PROD-CLUSTER-A',
      nodeName: 'vSphere Node 01',
      autoSimulateTelemetry: true,
      exportCompany: 'Enterprise IT Operations',
      soundAlerts: false,
    };
    setLocalSettings(defaultSettings);
    onUpdateSettings(defaultSettings);
  };

  const handleExportJson = () => {
    const report = {
      reportTimestamp: new Date().toISOString(),
      generator: 'vSphere CPU Analyzer',
      cluster: localSettings.clusterName,
      node: localSettings.nodeName,
      thresholds: {
        warningPercent: localSettings.warningThreshold,
        criticalPercent: localSettings.criticalThreshold,
      },
      virtualMachines: virtualMachines.map((vm) => {
        const rdyPercent = ((vm.readyMs * 100) / (vm.intervalSec * 1000)) / vm.vcpu;
        return {
          id: vm.id,
          name: vm.name,
          host: vm.host,
          vcpu: vm.vcpu,
          readyMs: vm.readyMs,
          intervalSec: vm.intervalSec,
          computedRdyPercent: +rdyPercent.toFixed(2),
          status: vm.status,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpu-analyzer-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full gap-6 font-sans text-sm text-[#e0e0e0] pb-10">
      {/* Header */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-light text-white uppercase tracking-[0.2em]">
              Analyzer Configuration & Thresholds
            </h2>
            <p className="text-xs text-white/40 mt-1 font-light">
              Customize %RDY contention thresholds, cluster telemetry parameters, and export reports.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 rounded-sm bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contention Thresholds Card */}
        <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-white/60" />
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              Contention Alert Thresholds
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/50">Warning Threshold (%RDY)</span>
                <span className="font-mono font-medium text-amber-300">
                  {localSettings.warningThreshold.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.5"
                value={localSettings.warningThreshold}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, warningThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-400 bg-white/10 h-1.5 rounded-sm cursor-pointer"
              />
              <span className="text-[10px] text-white/40 block mt-1 font-light">
                Standard vSphere best practice is 5.0%
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/50">Critical Threshold (%RDY)</span>
                <span className="font-mono font-medium text-rose-400">
                  {localSettings.criticalThreshold.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="7.0"
                max="20.0"
                step="0.5"
                value={localSettings.criticalThreshold}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, criticalThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-rose-500 bg-white/10 h-1.5 rounded-sm cursor-pointer"
              />
              <span className="text-[10px] text-white/40 block mt-1 font-light">
                Standard vSphere critical alert threshold is 10.0%
              </span>
            </div>
          </div>
        </div>

        {/* Cluster & Environment Identification */}
        <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-white/60" />
            <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
              vSphere Node & Cluster Binding
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">
                Target Cluster Name
              </label>
              <input
                type="text"
                value={localSettings.clusterName}
                onChange={(e) => setLocalSettings({ ...localSettings, clusterName: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 px-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1 font-mono uppercase tracking-wider">
                Active Node Identifier
              </label>
              <input
                type="text"
                value={localSettings.nodeName}
                onChange={(e) => setLocalSettings({ ...localSettings, nodeName: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 px-3 py-2 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoSimulateTelemetry}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, autoSimulateTelemetry: e.target.checked })
                  }
                  className="rounded-sm border-white/20 bg-[#080808] text-white focus:ring-0 cursor-pointer"
                />
                <span className="font-light">Enable periodic cluster telemetry polling</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="bg-[#0e0e0e] rounded-sm p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-light text-white uppercase tracking-[0.2em]">
            Export Diagnostic Report
          </h3>
          <p className="text-xs text-white/40 mt-1 font-light">
            Download full %RDY analysis data and sizing recommendations for audit records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-sm bg-white/[0.03] hover:bg-white/10 text-white font-mono text-[10px] uppercase font-medium tracking-wider flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5 text-white/60" />
            <span>Export JSON Audit</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-sm bg-white/[0.03] hover:bg-white/10 text-white/60 hover:text-white font-mono text-[10px] uppercase font-medium tracking-wider flex items-center gap-2 border border-white/15 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-sm bg-white hover:bg-white/90 text-black font-semibold text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
