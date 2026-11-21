'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SelectedRegion, StorageManager } from '../storage';

interface RegionContextType {
  region: SelectedRegion;
  setRegion: (region: SelectedRegion) => void;
  regionLabel: string;
}

const RegionContext = createContext<RegionContextType>({
  region: { country: 'India', scope: 'all_india' },
  setRegion: () => {},
  regionLabel: 'All India'
});

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<SelectedRegion>({ country: 'India', scope: 'all_india' });

  useEffect(() => {
    // Initial hydration from localStorage
    setRegionState(StorageManager.getRegion());

    // Subscribe to changes from anywhere in the window
    const unsubscribe = StorageManager.onRegionChange((newRegion) => {
      setRegionState(newRegion);
    });

    return unsubscribe;
  }, []);

  const setRegion = (newRegion: SelectedRegion) => {
    setRegionState(newRegion);
    StorageManager.setRegion(newRegion);
  };

  const getRegionLabel = () => {
    if (region.scope === 'online_only') return 'Online Only';
    if (region.scope === 'my_region' && region.city) return `${region.city}, ${region.state || 'IN'}`;
    if (region.scope === 'state' && region.state) return `${region.state}`;
    return 'All India';
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, regionLabel: getRegionLabel() }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);
