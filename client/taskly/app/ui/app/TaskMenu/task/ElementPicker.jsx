import { useState } from "react";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";

export default function ElementPicker({
  elementType,
  handleElementTypeChange,
  menuOpen,
  setMenuOpen,
}) {
  const [isFading, setIsFading] = useState(false);
  const [elements] = useState(["Task", "Workspace"]);

  const handleElementTypeChangeWithFade = (newType) => {
    setIsFading(true);
    setTimeout(() => {
      handleElementTypeChange(newType);
      setIsFading(false);
    }, 500);
    setMenuOpen(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <TaskMenuSectionContainer
      othersStyles="rounded-full justify-between items-center h-[80%] z-[200] relative cursor-pointer"
      onClick={toggleMenu}
    >
      <h2 className="pl-[4%] font-bold text-2xl text-text">{elementType}</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer z-[220] transition-transform duration-500 text-text ${
          menuOpen ? "transform rotate-180" : ""
        }`}
        viewBox="0 0 29 29"
        width="62.5"
        height="62.5"
        onClick={toggleMenu}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="m20.5 11.5-6 6-6-6"
        ></path>
      </svg>
      <div
        className={`absolute top-full mt-2 left-0 right-0 bg-primary
           shadow-lg rounded-lg transition-all duration-300 z-[255] ${
             menuOpen
               ? "opacity-100 max-h-[200px]"
               : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
           }`}
      >
        {elements.map((el) => (
          <div
            key={el}
            className="p-2 cursor-pointer hover:text-dominant transition-colors duration-300 text-text"
            onClick={() => handleElementTypeChangeWithFade(el)}
          >
            {el.charAt(0).toUpperCase() + el.slice(1)}
          </div>
        ))}
      </div>
    </TaskMenuSectionContainer>
  );
}
