export interface IntegrityValidator {
  validate(): boolean;
  checkSignature(data: any): boolean;
}

export interface ThreatDetector {
  analyze(): boolean;
  getThreats(): string[];
}

export interface SecurityConfig {
  checksumAlgorithm: string;
  validationInterval: number;
  threatThreshold: number;
}

export interface ThreatDetector {
  detectThreats(data: any): Promise<string[]>;
  analyzeRisk(threat: string): number;
}

export interface IntegrityValidator {
  validateIntegrity(data: any): boolean;
  checkSignature(data: any, signature: string): boolean;
}