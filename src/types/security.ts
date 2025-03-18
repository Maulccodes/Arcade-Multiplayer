export interface AttackSimulationResult {
  vulnerabilities: string[];
  riskLevel: 'low' | 'medium' | 'high';
  details: string;
  timestamp: number;
}

export interface SecurityRecommendation {
  id: string;
  description: string;
  priority: number;
  mitigation: string;
}

export interface ThreatDetector {
  detectThreats(): Promise<string[]>;
  analyzeRisk(threat: string): number;
}

export interface IntegrityValidator {
  validateState(state: any): boolean;
  checksum(data: any): string;
}

export interface SecurityMonitor {
  initialize(): void;
  monitor(): void;
  handleThreat(threat: string): void;
}