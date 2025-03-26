export interface UnitTestRunner {
  runTests(): Promise<TestResult[]>;
  getTestCount(): number;
}

export interface IntegrationTestRunner {
  runTests(): Promise<TestResult[]>;
  getTestCount(): number;
}

export interface E2ETestRunner {
  runTests(): Promise<TestResult[]>;
  getTestCount(): number;
}

export interface PerformanceTestRunner {
  runTests(): Promise<TestResult[]>;
  getTestCount(): number;
  getBenchmarkResults(): BenchmarkResult[];
}

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: Error;
}

export interface BenchmarkResult {
  name: string;
  score: number;
  unit: string;
}

export interface TestReport {
  unitTests: TestResult[];
  integrationTests: TestResult[];
  e2eTests: TestResult[];
  performanceTests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
}