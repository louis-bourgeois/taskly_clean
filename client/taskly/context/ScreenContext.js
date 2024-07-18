// contexts/ScreenContext.js
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const value = useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};