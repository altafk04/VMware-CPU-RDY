export interface VirtualMachine {
  id: string;
  name: string;
  host: string;
  cluster: string;
  vcpu: number;
  readyMs: number;
  intervalSec: number;
  cstpMs: number;
  memoryGb: number;
  cpuUsagePercent: number;
  os: string;
  status: 'healthy' | 'warning' | 'critical';
  powerState: 'poweredOn' | 'poweredOff' | 'suspended';
  numaSockets: number;
  coresPerSocket: number;
}

export interface IntervalOption {
  rollup: string;
  seconds: number;
  intervalMs: number;
  description: string;
}

export type ThresholdStatus = 'healthy' | 'warning' | 'critical';

export interface RightSizingPrediction {
  vcpu: number;
  percentage: number;
  status: ThresholdStatus;
  isCurrent: boolean;
  deltaPercent: number;
}

export interface HistoricalPoint {
  time: string;
  readyPercent: number;
  cstpPercent: number;
  cpuUsedPercent: number;
  readyMs: number;
}

export type ActiveTab = 'analyzer' | 'calculator' | 'vcenter' | 'historical-trends' | 'best-practices' | 'settings';

export interface AlertNotification {
  id: string;
  vmName: string;
  title: string;
  message: string;
  severity: 'warning' | 'critical' | 'info';
  timestamp: string;
  read: boolean;
  readyPercent: number;
}

export interface AppSettings {
  warningThreshold: number; // default 5.0
  criticalThreshold: number; // default 10.0
  clusterName: string;
  nodeName: string;
  autoSimulateTelemetry: boolean;
  exportCompany: string;
  soundAlerts: boolean;
}
