import React, { useState, useEffect } from 'react';
import { ActiveTab, VirtualMachine, AlertNotification, AppSettings } from './types';
import { MOCK_VMS, INITIAL_NOTIFICATIONS, calculateRdyPercentage } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AnalyzerView } from './components/AnalyzerView';
import { HistoricalTrendsView } from './components/HistoricalTrendsView';
import { BestPracticesView } from './components/BestPracticesView';
import { SettingsView } from './components/SettingsView';
import { TopologyModal } from './components/TopologyModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>(MOCK_VMS);
  
  // Default to app-backend-worker-01 with 1200ms, 300s, 4 vCPU (exact match for screenshot values)
  const [selectedVm, setSelectedVm] = useState<VirtualMachine | null>(() => {
    return MOCK_VMS.find((vm) => vm.id === 'vm-104') || MOCK_VMS[0];
  });

  const [notifications, setNotifications] = useState<AlertNotification[]>(INITIAL_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isTopologyOpen, setIsTopologyOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<AppSettings>({
    warningThreshold: 5.0,
    criticalThreshold: 10.0,
    clusterName: 'PROD-CLUSTER-A',
    nodeName: 'vSphere Node 01',
    autoSimulateTelemetry: true,
    exportCompany: 'Enterprise IT Operations',
    soundAlerts: false,
  });

  // Calculate cluster status overview
  const totalVms = virtualMachines.length;
  const criticalCount = virtualMachines.filter((v) => v.status === 'critical').length;
  const warningCount = virtualMachines.filter((v) => v.status === 'warning').length;
  
  const clusterStatusText = criticalCount > 0 
    ? `${criticalCount} Contended VM${criticalCount > 1 ? 's' : ''}` 
    : warningCount > 0 
    ? 'Cluster Warning' 
    : 'Cluster Optimized';

  // Manual or periodic telemetry poll
  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Add slight jitter to simulate live scheduler counters
      setVirtualMachines((prev) =>
        prev.map((vm) => {
          const jitter = (Math.random() - 0.5) * 80;
          const newReady = Math.max(100, Math.round(vm.readyMs + jitter));
          const rdyPercent = calculateRdyPercentage(newReady, vm.intervalSec, vm.vcpu);
          const newStatus = rdyPercent >= settings.criticalThreshold 
            ? 'critical' 
            : rdyPercent >= settings.warningThreshold 
            ? 'warning' 
            : 'healthy';
          
          return {
            ...vm,
            readyMs: newReady,
            status: newStatus,
          };
        })
      );
      setIsRefreshing(false);
    }, 600);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleApplyVcpuRecommendation = (newVcpu: number) => {
    if (!selectedVm) return;
    setVirtualMachines((prev) =>
      prev.map((vm) => (vm.id === selectedVm.id ? { ...vm, vcpu: newVcpu } : vm))
    );
    setSelectedVm((prev) => (prev ? { ...prev, vcpu: newVcpu } : null));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] flex font-sans selection:bg-white/20 selection:text-white">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedVmName={selectedVm?.name}
        clusterStatus={clusterStatusText}
      />

      {/* Main Container with 64px (w-64) sidebar margin */}
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <Header
          virtualMachines={virtualMachines}
          selectedVm={selectedVm}
          onSelectVm={(vm) => setSelectedVm(vm)}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onRefreshTelemetry={handleRefreshTelemetry}
          isRefreshing={isRefreshing}
          clusterStatusText={clusterStatusText}
        />

        {/* Main Content Body */}
        <main className="pt-20 px-8 flex-1">
          {activeTab === 'analyzer' && (
            <AnalyzerView
              currentVm={selectedVm}
              onOpenTopologyModal={() => setIsTopologyOpen(true)}
              onApplyVcpuRecommendation={handleApplyVcpuRecommendation}
            />
          )}

          {activeTab === 'historical-trends' && (
            <HistoricalTrendsView
              currentVm={selectedVm}
              virtualMachines={virtualMachines}
              onSelectVm={(vm) => setSelectedVm(vm)}
            />
          )}

          {activeTab === 'best-practices' && <BestPracticesView />}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
              virtualMachines={virtualMachines}
            />
          )}
        </main>
      </div>

      {/* Cluster Topology Modal */}
      <TopologyModal
        isOpen={isTopologyOpen}
        onClose={() => setIsTopologyOpen(false)}
        virtualMachines={virtualMachines}
        onSelectVm={(vm) => setSelectedVm(vm)}
      />
    </div>
  );
}
