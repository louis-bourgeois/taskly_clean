"use client";
import { createContext, useState } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const toggleAddMenu = () => {
    setIsAddMenuOpen((prev) => !prev);
  };
  return (
    <MenuContext.Provider value={{ isAddMenuOpen, toggleAddMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
