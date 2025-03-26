export interface AttackSimulationResult {
  vulnerabilities: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityRecommendation {
  risk: string;
  mitigation: string;
}

export interface ThreatDetector {
  detectThreats(): Promise<string[]>;
  analyzeRisk(threat: string): number;
}

export interface IntegrityValidator {
  validate(): boolean;
  checkSignature(data: any): boolean;
}

export interface ThreatDetector {
  analyze(): boolean;
  getThreats(): string[];
}

export interface SecurityMonitor {
  initialize(): void;
  monitor(): void;
  handleThreat(threat: string): void;
}