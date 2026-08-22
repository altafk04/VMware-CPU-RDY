import { IntervalOption, VirtualMachine, AlertNotification } from '../types';

export const STANDARD_INTERVALS: IntervalOption[] = [
  {
    rollup: 'Real-time',
    seconds: 20,
    intervalMs: 20000,
    description: 'vCenter real-time 20-second sample window',
  },
  {
    rollup: 'Past Day',
    seconds: 300,
    intervalMs: 300000,
    description: '5-minute average rollup over 24 hours',
  },
  {
    rollup: 'Past Week',
    seconds: 1800,
    intervalMs: 1800000,
    description: '30-minute average rollup over 7 days',
  },
  {
    rollup: 'Past Month',
    seconds: 7200,
    intervalMs: 7200000,
    description: '2-hour average rollup over 30 days',
  },
];

export const MOCK_VMS: VirtualMachine[] = [
  {
    id: 'vm-101',
    name: 'sql-prod-db-01',
    host: 'esx-compute-04.datacenter.corp',
    cluster: 'PROD-CLUSTER-A',
    vcpu: 8,
    readyMs: 14400,
    intervalSec: 300,
    cstpMs: 2200,
    memoryGb: 128,
    cpuUsagePercent: 78.4,
    os: 'Red Hat Enterprise Linux 9.2',
    status: 'warning',
    powerState: 'poweredOn',
    numaSockets: 2,
    coresPerSocket: 4,
  },
  {
    id: 'vm-102',
    name: 'k8s-worker-node-04',
    host: 'esx-compute-02.datacenter.corp',
    cluster: 'PROD-CLUSTER-A',
    vcpu: 16,
    readyMs: 58000,
    intervalSec: 300,
    cstpMs: 11400,
    memoryGb: 64,
    cpuUsagePercent: 91.2,
    os: 'Ubuntu 24.04 LTS',
    status: 'critical',
    powerState: 'poweredOn',
    numaSockets: 2,
    coresPerSocket: 8,
  },
  {
    id: 'vm-103',
    name: 'web-gateway-edge-02',
    host: 'esx-compute-01.datacenter.corp',
    cluster: 'DMZ-CLUSTER-01',
    vcpu: 2,
    readyMs: 420,
    intervalSec: 300,
    cstpMs: 40,
    memoryGb: 16,
    cpuUsagePercent: 34.0,
    os: 'Alpine Linux 3.20',
    status: 'healthy',
    powerState: 'poweredOn',
    numaSockets: 1,
    coresPerSocket: 2,
  },
  {
    id: 'vm-104',
    name: 'app-backend-worker-01',
    host: 'esx-compute-03.datacenter.corp',
    cluster: 'PROD-CLUSTER-A',
    vcpu: 4,
    readyMs: 1200,
    intervalSec: 300,
    cstpMs: 110,
    memoryGb: 32,
    cpuUsagePercent: 46.5,
    os: 'Debian 12 Bookworm',
    status: 'healthy',
    powerState: 'poweredOn',
    numaSockets: 1,
    coresPerSocket: 4,
  },
  {
    id: 'vm-105',
    name: 'sap-hana-db-primary',
    host: 'esx-compute-08.datacenter.corp',
    cluster: 'SAP-HANA-CLUSTER',
    vcpu: 32,
    readyMs: 98500,
    intervalSec: 300,
    cstpMs: 24000,
    memoryGb: 512,
    cpuUsagePercent: 88.0,
    os: 'SUSE Linux Enterprise Server 15 SP5',
    status: 'critical',
    powerState: 'poweredOn',
    numaSockets: 4,
    coresPerSocket: 8,
  },
  {
    id: 'vm-106',
    name: 'redis-cache-cluster-01',
    host: 'esx-compute-01.datacenter.corp',
    cluster: 'PROD-CLUSTER-A',
    vcpu: 4,
    readyMs: 280,
    intervalSec: 300,
    cstpMs: 15,
    memoryGb: 24,
    cpuUsagePercent: 19.8,
    os: 'Ubuntu 22.04 LTS',
    status: 'healthy',
    powerState: 'poweredOn',
    numaSockets: 1,
    coresPerSocket: 4,
  },
  {
    id: 'vm-107',
    name: 'kafka-broker-node-03',
    host: 'esx-compute-05.datacenter.corp',
    cluster: 'DATA-STREAM-CLUSTER',
    vcpu: 8,
    readyMs: 19600,
    intervalSec: 300,
    cstpMs: 3800,
    memoryGb: 64,
    cpuUsagePercent: 72.1,
    os: 'Red Hat Enterprise Linux 8.8',
    status: 'warning',
    powerState: 'poweredOn',
    numaSockets: 2,
    coresPerSocket: 4,
  }
];

export const INITIAL_NOTIFICATIONS: AlertNotification[] = [
  {
    id: 'notif-1',
    vmName: 'k8s-worker-node-04',
    title: 'High CPU Ready Alert (>10%)',
    message: 'Computed %RDY reached 12.08%. Hypervisor scheduling contention detected on esx-compute-02.',
    severity: 'critical',
    timestamp: '3 mins ago',
    read: false,
    readyPercent: 12.08,
  },
  {
    id: 'notif-2',
    vmName: 'sql-prod-db-01',
    title: 'Contention Warning (6.00%)',
    message: 'VM is experiencing 6.00% CPU Ready during backup window. Consider reducing to 4 vCPUs or setting CPU reservation.',
    severity: 'warning',
    timestamp: '18 mins ago',
    read: false,
    readyPercent: 6.00,
  },
  {
    id: 'notif-3',
    vmName: 'sap-hana-db-primary',
    title: 'vNUMA Misalignment & Co-Stop Alert',
    message: 'High %CSTP (8.0%) indicates vCPUs skewing across NUMA nodes during synchronized execution.',
    severity: 'critical',
    timestamp: '42 mins ago',
    read: true,
    readyPercent: 10.26,
  },
  {
    id: 'notif-4',
    vmName: 'Cluster Status',
    title: 'DRS Recommendation Executed',
    message: 'Distributed Resource Scheduler migrated web-gateway-edge-02 to balance CPU scheduler queue depth.',
    severity: 'info',
    timestamp: '1 hour ago',
    read: true,
    readyPercent: 0.14,
  }
];

export function calculateRdyPercentage(ms: number, intervalSeconds: number, vcpu: number): number {
  if (intervalSeconds <= 0 || vcpu <= 0) return 0;
  const intervalMs = intervalSeconds * 1000;
  // Standard Broadcom KB 387750 formula: ((Ready ms * 100) / (Interval ms)) / vCPUs
  const percentage = ((ms * 100) / intervalMs) / vcpu;
  return Math.max(0, percentage);
}

export function generateHistoricalData(baseReadyMs: number, intervalSec: number, vcpu: number, pointsCount = 24) {
  const result = [];
  const now = new Date();
  
  for (let i = pointsCount - 1; i >= 0; i--) {
    const timePoint = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourLabel = timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // add organic variance with occasional spikes (e.g. at 09:00 and 14:00)
    const hour = timePoint.getHours();
    let spikeMultiplier = 1;
    if (hour >= 9 && hour <= 11) spikeMultiplier = 1.6 + Math.random() * 0.4;
    else if (hour >= 14 && hour <= 16) spikeMultiplier = 1.9 + Math.random() * 0.5;
    else if (hour >= 1 && hour <= 3) spikeMultiplier = 0.5; // night lulls
    else spikeMultiplier = 0.8 + Math.random() * 0.4;

    const randomizedMs = Math.max(80, Math.round(baseReadyMs * spikeMultiplier));
    const rdyPercent = calculateRdyPercentage(randomizedMs, intervalSec, vcpu);
    const cstpPercent = Math.max(0.01, +(rdyPercent * (0.2 + Math.random() * 0.3)).toFixed(2));
    const cpuUsed = Math.min(99, Math.max(15, Math.round(40 * spikeMultiplier + (Math.random() * 10))));

    result.push({
      time: hourLabel,
      readyPercent: +rdyPercent.toFixed(2),
      cstpPercent,
      cpuUsedPercent: cpuUsed,
      readyMs: randomizedMs,
    });
  }

  return result;
}
