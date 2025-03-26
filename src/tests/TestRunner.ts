import { UnitTestRunner, IntegrationTestRunner, E2ETestRunner, PerformanceTestRunner, TestResult, TestReport } from './types';

export class TestRunner {
  private unitTestRunner: UnitTestRunner;
  private integrationTestRunner: IntegrationTestRunner;
  private e2eTestRunner: E2ETestRunner;
  private performanceTestRunner: PerformanceTestRunner;

  constructor(
    unitRunner: UnitTestRunner,
    integrationRunner: IntegrationTestRunner,
    e2eRunner: E2ETestRunner,
    performanceRunner: PerformanceTestRunner
  ) {
    this.unitTestRunner = unitRunner;
    this.integrationTestRunner = integrationRunner;
    this.e2eTestRunner = e2eRunner;
    this.performanceTestRunner = performanceRunner;
  }

  async runAllTests(): Promise<TestReport> {
    const unitResults = await this.unitTestRunner.runTests();
    const integrationResults = await this.integrationTestRunner.runTests();
    const e2eResults = await this.e2eTestRunner.runTests();
    const performanceResults = await this.performanceTestRunner.runTests();

    return this.generateTestReport([
      unitResults,
      integrationResults,
      e2eResults,
      performanceResults
    ]);
  }

  private generateTestReport(allResults: TestResult[][]): TestReport {
    const unitTests = allResults[0];
    const integrationTests = allResults[1];
    const e2eTests = allResults[2];
    const performanceTests = allResults[3];

    const total = unitTests.length + integrationTests.length + e2eTests.length + performanceTests.length;
    const passed = allResults.flat().filter(result => result.passed).length;
    const failed = total - passed;
    const duration = allResults.flat().reduce((sum, result) => sum + result.duration, 0);

    return {
      unitTests,
      integrationTests,
      e2eTests,
      performanceTests,
      summary: {
        total,
        passed,
        failed,
        duration
      }
    };
  }
}