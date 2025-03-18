/**
 * Main test runner for the arcade multiplayer application
 */
class TestRunner {
  private unitTestRunner: UnitTestRunner;
  private integrationTestRunner: IntegrationTestRunner;
  private e2eTestRunner: E2ETestRunner;
  private performanceTestRunner: PerformanceTestRunner;

  async runAllTests(): Promise<TestSummary> {
    // Run unit tests
    const unitResults = await this.unitTestRunner.run([
      'core-components',
      'game-logic',
      'networking',
      'security'
    ]);

    // Run integration tests
    const integrationResults = await this.integrationTestRunner.run([
      'multiplayer-sync',
      'state-management',
      'authentication-flow'
    ]);

    // Run end-to-end tests
    const e2eResults = await this.e2eTestRunner.run([
      'full-game-session',
      'multiplayer-match',
      'tournament-flow'
    ]);

    // Run performance tests
    const performanceResults = await this.performanceTestRunner.run([
      'load-testing',
      'stress-testing',
      'network-resilience'
    ]);

    return this.generateTestReport([
      unitResults,
      integrationResults,
      e2eResults,
      performanceResults
    ]);
  }
}