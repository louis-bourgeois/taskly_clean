import { useEffect, useRef, useState } from "react";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import Circle from "../Circle";
import DropdownMenu from "../DropdownMenu";
import SectionTitle from "../SectionTitle";

export default function Appearance({ transitionStyles }) {
  const { updatePreference, preferences } = useUserPreferences();
  const [theme, setTheme] = useState(preferences?.Theme);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const siblingRefs = useRef([]);

  const rgbToHex = (rgb) => {
    let hex = rgb
      .match(/\d+/g)
      .map((x) => parseInt(x).toString(16).padStart(2, "0"))
      .join("");
    return `#${hex}`;
  };

  const rows = [
    { color: "#ffffff" },
    { color: "#f7f4ed" },
    { color: "#007AFF" },
    { color: "#DE9F9F" },
    { color: "#71EAE2" },
    { color: "#FF659C" },
    { color: "#000000" },
  ];

  const handleThemeClick = async (value) => {
    setTheme(value);
    await updatePreference({ key: "Theme", value });
  };

  const handleCircleClick = async (index) => {
    const siblingDiv = siblingRefs.current[index];
    if (siblingDiv) {
      setSelectedCircle(index);
      const bgColor = window.getComputedStyle(siblingDiv).backgroundColor;
      console.log(rgbToHex(bgColor));
      await updatePreference({
        key: "Color_Theme",
        value: rgbToHex(bgColor),
      });
    }
  };
  useEffect(() => {
    console.log(preferences?.Theme);
    if (preferences?.Color_Theme) {
      const initialThemeIndex = rows.findIndex(
        (row) =>
          row.color.toLowerCase() === preferences.Color_Theme.toLowerCase()
      );
      setSelectedCircle(initialThemeIndex !== -1 ? initialThemeIndex : null);
    } else {
      setSelectedCircle(null);
    }
  }, [preferences, rows]);
  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <SectionTitle>Theme</SectionTitle>
      <DropdownMenu
        options={["Light", "Dark"]}
        title={theme}
        onClick={handleThemeClick}
      />
      <SectionTitle>Color Theme</SectionTitle>
      <div className="w-full flex flex-col justify-around gap-[1.25vw]">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`w-full flex justify-between items-center`}
          >
            <div
              ref={(el) => (siblingRefs.current[index] = el)}
              style={{ backgroundColor: row.color }}
              className={`rounded-[10px] w-[87.5%] h-[5vh]  ${
                (row.color === "#ffffff" || row.color === "#f7f4ed") &&
                "border border-secondary"
              }`}
            ></div>
            <Circle
              borderColor="dominant"
              onColorChange={() => handleCircleClick(index)}
              isSelected={selectedCircle === index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
