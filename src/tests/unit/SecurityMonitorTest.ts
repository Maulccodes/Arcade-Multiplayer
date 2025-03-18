/**
 * Unit tests for SecurityMonitor component
 */
describe('SecurityMonitor', () => {
  let securityMonitor: SecurityMonitor;
  let mockThreatDetector: jest.Mocked<ThreatDetector>;
  let mockValidator: jest.Mocked<IntegrityValidator>;

  beforeEach(() => {
    mockThreatDetector = {
      detectThreats: jest.fn(),
      analyzeThreatPattern: jest.fn()
    };
    
    securityMonitor = new SecurityMonitor(
      mockThreatDetector,
      mockValidator
    );
  });

  /**
   * Test threat detection functionality
   */
  describe('analyzeFrame', () => {
    it('should detect and classify threats correctly', async () => {
      const mockFrameData = createMockFrameData();
      const result = await securityMonitor.analyzeFrame(mockFrameData);
      expect(result.threatLevel).toBeDefined();
      expect(result.recommendations).toHaveLength(2);
    });
  });
});