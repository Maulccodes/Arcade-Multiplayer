import React, { useRef } from 'react';
import { EmulatorConfig } from '../../common/types';

interface ROMSelectorProps {
  onROMSelect: (romPath: string) => void;
  supportedFormats: string[];
}

const ROMSelector: React.FC<ROMSelectorProps> = ({ onROMSelect, supportedFormats }) => {
  const [selectedROM, setSelectedROM] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ROMMetadata | null>(null);
  const [isCompatible, setIsCompatible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleROMSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    try {
      const romManager = new ROMManager();
      
      // Check compatibility first
      const compatible = await romManager.checkCompatibility(file.path);
      setIsCompatible(compatible);
      
      if (compatible) {
        // Extract metadata
        const meta = await romManager.extractMetadata(file.path);
        setMetadata(meta);
        
        // Cache the ROM
        const cachedPath = await romManager.cacheROM(file.path);
        setSelectedROM(cachedPath);
      }
    } catch (error) {
      console.error('ROM processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rom-selector">
      <div className="rom-input">
        <input
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleROMSelect}
          disabled={isLoading}
        />
        {isLoading && <span className="loading-indicator">Processing ROM...</span>}
      </div>
      
      {metadata && (
        <div className="rom-metadata">
          <h3>{metadata.fileName}</h3>
          <div className="metadata-grid">
            <div>System: {metadata.system}</div>
            <div>Region: {metadata.region}</div>
            <div>Size: {formatFileSize(metadata.fileSize)}</div>
            <div>Last Played: {metadata.lastPlayed?.toLocaleDateString()}</div>
          </div>
          <div className="compatibility-status">
            Status: {isCompatible ? '✓ Compatible' : '✗ Incompatible'}
          </div>
        </div>
      )}
      
      {selectedROM && isCompatible && (
        <button 
          onClick={() => onROMSelect(selectedROM)}
          className="load-rom-button"
        >
          Load ROM
        </button>
      )}
    </div>
  );
};

export default ROMSelector;