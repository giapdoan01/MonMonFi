"use client";

import React, { createContext, useContext, useState } from "react";

interface NFTContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1); // mỗi lần gọi tăng 1 để kích hoạt cập nhật
  };

  return (
    <NFTContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </NFTContext.Provider>
  );
};

export const useNFT = (): NFTContextType => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error("useNFT must be used within an NFTProvider");
  }
  return context;
};
