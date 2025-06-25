import React, { createContext, useContext, useState } from 'react';

const TileContext = createContext();

export function TileProvider({ children }) {
  const [tileOfInterest, setTileOfInterest] = useState(null);
  return (
    <TileContext.Provider value={{ tileOfInterest, setTileOfInterest }}>
      {children}
    </TileContext.Provider>
  );
}

export function useTileContext() {
  return useContext(TileContext);
}
