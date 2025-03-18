import { NetworkManager } from '../network/NetworkManager';

describe('NetworkManager', () => {
  let networkManager: NetworkManager;

  beforeEach(() => {
    networkManager = new NetworkManager();
  });

  test('should initialize network connection', () => {
    expect(networkManager.isConnected()).toBeFalsy();
  });

  test('should handle connection state', async () => {
    await networkManager.connect();
    expect(networkManager.isConnected()).toBeTruthy();
  });
});