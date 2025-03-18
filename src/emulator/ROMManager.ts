interface ROMMetadata {
  fileName: string;
  fileSize: number;
  hash: string;
  system: string;
  region: string;
  title?: string;
  releaseYear?: string;
  supportedFeatures: string[];
  lastPlayed?: Date;
}

class ROMManager {
  private readonly cacheDir = 'cache/roms';
  private readonly metadataCache = new Map<string, ROMMetadata>();
  
  async extractMetadata(romPath: string): Promise<ROMMetadata> {
    const fileBuffer = await fs.readFile(romPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Extract ROM header information
    const headerInfo = await this.extractROMHeader(fileBuffer);
    
    const metadata: ROMMetadata = {
      fileName: path.basename(romPath),
      fileSize: fileBuffer.length,
      hash,
      system: this.detectSystem(headerInfo),
      region: this.detectRegion(headerInfo),
      supportedFeatures: this.detectFeatures(headerInfo),
      lastPlayed: new Date()
    };
    
    this.metadataCache.set(hash, metadata);
    return metadata;
  }

  async checkCompatibility(romPath: string): Promise<boolean> {
    const metadata = await this.extractMetadata(romPath);
    
    // Check system compatibility
    if (!this.isSupportedSystem(metadata.system)) {
      return false;
    }
    
    // Check ROM size limits
    if (metadata.fileSize > this.getMaxROMSize(metadata.system)) {
      return false;
    }
    
    // Check required features
    const requiredFeatures = this.getRequiredFeatures();
    if (!requiredFeatures.every(f => metadata.supportedFeatures.includes(f))) {
      return false;
    }
    
    return true;
  }

  async cacheROM(romPath: string): Promise<string> {
    const metadata = await this.extractMetadata(romPath);
    const cachedPath = path.join(this.cacheDir, metadata.hash);
    
    // Check if already cached
    if (await fs.exists(cachedPath)) {
      return cachedPath;
    }
    
    // Cache the ROM file
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.copyFile(romPath, cachedPath);
    
    return cachedPath;
  }
}