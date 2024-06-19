"use client";
import { createContext, useState } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const toggleTaskMenu = () => {
    setIsTaskMenuOpen((prev) => !prev);
  };
  return (
    <MenuContext.Provider value={{ isTaskMenuOpen, toggleTaskMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
